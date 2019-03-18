const babel = require('@babel/core');
const connect = require('gulp-connect');
const del = require('del');
const fs = require('fs');
const glob = require('glob');
const gulp = require('gulp');
const gulpHash = require('gulp-hash');
const log = require('fancy-log');
const marked = require('marked');
const newy = require('gulp-newy');
const path = require('path');
const pretty = require('pretty');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const responsive = require('gulp-responsive');
const sass = require('gulp-sass');
const sizeOf = require('image-size');
const webpack = require('webpack');
const yaml = require('yaml');

const defaultConfig = {
  site_url: 'https://www.example.com',
  title: 'Hello World!',
  description: 'This is your new site made with yagss',
  src_dir: 'src',
  dest_dir: 'public',
  templates_dir: 'templates',
  cache_dir: '.cache',
  scss_file: 'scss/main.scss',
  img_sizes: [
    440,
    660,
    880,
    1320,
    1760,
  ],
};


const configPath = path.resolve(process.cwd(), 'yagss-config.yaml');
const configFromFile = yaml.parse(fs.readFileSync(configPath, 'utf8'));
const config = Object.assign(defaultConfig, configFromFile);
const srcDir = path.resolve(process.cwd(), config.src_dir);
const destDir = path.resolve(process.cwd(), config.dest_dir);
const templatesDir = path.resolve(process.cwd(), config.templates_dir);
const cacheDir = path.resolve(process.cwd(), config.cache_dir);
const scssPath = path.resolve(process.cwd(), config.scss_file);

const parsedScssPath = path.parse(scssPath);
config.css_file_relative = `${parsedScssPath.name}.css`;

const docStrings = {
  html: '<!DOCTYPE html>',
  xml: '<?xml version="1.0" encoding="utf-8" standalone="yes"?>',
};


function readFilePromise(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function writeFilePromise(filePath, data, options) {
  return new Promise((resolve, reject) => {
    const parsedPath = path.parse(filePath);
    fs.writeFile(filePath, data, options, (err1) => {
      if (err1) {
        if (err1.code === 'ENOENT') {
          fs.mkdir(parsedPath.dir, { recursive: true }, (err2) => {
            if (err2) {
              reject(err2);
            } else {
              fs.writeFile(filePath, data, options, (err3) => {
                if (err3) {
                  reject(err3);
                } else {
                  resolve();
                }
              });
            }
          });
        } else {
          reject(err1);
        }
      } else {
        resolve();
      }
    });
  });
}

function globPromise(pattern, options) {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}

function transpileTemplate(srcPath, destPath) {
  return new Promise((resolve, reject) => {
    readFilePromise(srcPath, 'utf8').then((fileContents) => {
      babel.transform(
        fileContents,
        {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
        (err, result) => {
          if (err) {
            log(err);
            reject(err);
          }
          writeFilePromise(destPath, result.code).then(resolve);
        }
      );
    });
  });
}

function templates() {
  return new Promise((resolve) => {
    globPromise(`${templatesDir}/*.jsx`).then((jsxPaths) => {
      const templatePromises = jsxPaths.map((jsxPath) => {
        const parsedPath = path.parse(jsxPath);
        const dest = path.join(cacheDir, 'templates', parsedPath.base);
        return transpileTemplate(jsxPath, dest);
      });
      Promise.all(templatePromises).then(() => {
        log('templates rendered.');
        resolve();
      });
    });
  });
}

function transpileJs(entries, outputPath) {
  const envMode = process.env.NODE_ENV || 'development';
  return new Promise((resolve, reject) => {
    if (Object.keys(entries).length === 0) {
      resolve({});
    } else {
      webpack({
        mode: envMode,
        entry: entries,
        output: {
          path: outputPath,
          filename: '[name].[chunkhash:8].js',
        },
        optimization: {
          splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: (module) => {
                  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                  return packageName.replace('@', '');
                },
              },
            },
          },
        },
        cache: {
          type: 'filesystem',
        },
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    '@babel/env',
                    '@babel/preset-react',
                  ],
                },
              },
            },
          ],
        },
      }, (err, stats) => {
        if (err || stats.hasErrors()) {
          const debugInfo = { entries, errors: [] };
          if (err) {
            debugInfo.errors.push(err);
          }
          if (stats.compilation && stats.compilation.errors) {
            stats.compilation.errors.forEach((e) => {
              log.error(e);
              debugInfo.errors.push(e);
            });
          }
          log.error(`error transpiling js: ${JSON.stringify(entries)}`);
          reject(err);
        } else {
          const resolutionObj = {};
          stats.compilation.entrypoints.forEach((ep) => {
            const epFiles = ep.chunks.reduce((acc, val) => acc.concat(val.files), []);
            const withSlashes = epFiles.map(f => path.join('/', f));
            resolutionObj[ep.options.name] = withSlashes;
          });
          resolve(resolutionObj);
        }
      });
    }
  });
}

function jsList(unknownInput, baseDir) {
  if (Array.isArray(unknownInput)) {
    return unknownInput.map(item => path.resolve(baseDir, item));
  }
  if (unknownInput && typeof unknownInput === 'string') {
    return [path.resolve(baseDir, unknownInput)];
  }
  return [];
}

function parseYagss(filePath, baseDir) {
  return new Promise((resolve, reject) => {
    readFilePromise(filePath, 'utf8').then((f) => {
      const delimiter = '-*-*-*-';
      const delimiterIndex = f.indexOf(delimiter);
      const preParsed = delimiterIndex > -1 ? f.slice(0, f.indexOf(delimiter)) : f;
      const parsed = Object.assign({}, config, yaml.parse(preParsed));
      const preContent = delimiterIndex > -1 ? f.slice(delimiterIndex + delimiter.length) : '';
      parsed.content = marked(preContent, { smartypants: true });
      if (!parsed.extension) {
        parsed.extension = 'html';
      }
      const parsedPath = path.parse(filePath);
      const relativeDir = parsedPath.dir.slice(baseDir.length);
      parsed.js = jsList(parsed.js, parsedPath.dir);
      parsed.slug = parsedPath.name;
      parsed.relativeDir = relativeDir;
      parsed.relativeURL = `${relativeDir}/${parsedPath.name}.${parsed.extension}`;
      parsed.url = `${parsed.site_url}${parsed.relativeURL}`;
      // cache[filePath] = parsed;
      resolve(parsed);
    }).catch((error) => {
      log(error);
      reject(error);
    });
  });
}

function paginate(parsedList) {
  const bigObj = {};
  parsedList.forEach((parsed) => {
    let noDirectories = true;
    Object.keys(parsed).forEach((k) => {
      if (typeof parsed[k] === 'object' && parsed[k].directory) {
        noDirectories = false;
        // const filterStr = path.resolve('/', parsed[k].directory);
        const filterStr = `/${parsed[k].directory}/`;
        const matches = parsedList.filter(item => item.relativeURL.startsWith(filterStr));
        if (parsed[k].sortOn) {
          matches.sort((a, b) => a[parsed[k].sortOn].localeCompare(b[parsed[k].sortOn]));
        }
        if (parsed[k].reversed) {
          matches.reverse();
        }
        let numPages = 1;
        if (parsed.paginate && parsed.paginate.key === k) {
          numPages = Math.ceil(matches.length / parsed.paginate.count);
        }
        for (let i = 0; i < numPages; i += 1) {
          const parsedCopy = JSON.parse(JSON.stringify(parsed));
          parsedCopy[parsed.paginate.key] = matches.slice(
            i * parsed.paginate.count, (i + 1) * parsed.paginate.count
          );
          for (let j = 0; j < parsedCopy[parsed.paginate.key].length; j += 1) {
            if (parsedCopy[parsed.paginate.key][j].js) {
              parsedCopy.js = parsedCopy.js.concat(parsedCopy[parsed.paginate.key][j].js);
            }
          }
          const oldStem = parsed.relativeURL.slice(
            parsed.relativeDir.length + 1, -(parsed.extension.length + 1)
          );
          if (i < (numPages - 1)) {
            parsedCopy.next = `${oldStem}${i + 2}.${parsed.extension}`;
          }
          if (i > 0) {
            const newStem = `${oldStem}${i + 1}`;
            parsedCopy.relativeURL = `${parsed.relativeDir}/${newStem}.${parsed.extension}`;
            parsedCopy.url = `${parsed.site_url}${parsedCopy.relativeURL}`;
            parsedCopy.prev = `${oldStem}${i > 1 ? i : ''}.${parsed.extension}`;
          }
          bigObj[parsedCopy.relativeURL] = parsedCopy;
        }
      }
    });
    if (noDirectories) {
      bigObj[parsed.relativeURL] = parsed;
    }
  });
  return bigObj;
}

function getJsEntries(bigObj) {
  const entriesObj = {};
  Object.values(bigObj).forEach((item) => {
    if (item.js && item.js.length > 0) {
      entriesObj[item.relativeURL] = item.js;
    }
  });
  return entriesObj;
}

function imageSizePromise(filePath) {
  return new Promise((resolve, reject) => {
    sizeOf(filePath, (error, dimensions) => {
      if (error) {
        reject(error);
      } else {
        resolve(dimensions);
      }
    });
  });
}

function addExifData(parsedList, baseDir) {
  return new Promise((resolve, reject) => {
    const exifPromises = [];
    parsedList.forEach((item) => {
      if (item.images) {
        item.images.forEach((image) => {
          const imgDir = path.join(baseDir, item.relativeDir, image.filename);
          const filePath = `${imgDir}.jpg`;
          // const addExif = new Promise((resv) => {
          //   exifPromise(filePath).then((exifData) => {
          //     image.exif = exifData;
          //     resv();
          //   });
          // });
          const addSize = new Promise((resv) => {
            imageSizePromise(filePath).then((dimensions) => {
              image.size = dimensions;
              resv();
            });
          });
          // exifPromises.push(addExif);
          exifPromises.push(addSize);
        });
      }
    });
    Promise.all(exifPromises).then(() => {
      resolve(parsedList);
    });
  });
}

function writeYagssFile(yagssObj, destDirectory) {
  log(`${yagssObj.relativeDir}/${yagssObj.slug}.yagss => ${yagssObj.relativeURL}`);
  const templatePath = `${cacheDir}/templates/${yagssObj.template}.jsx`
  delete require.cache[require.resolve(templatePath)];
  const Template = require(templatePath);
  const element = React.createElement(Template.default, yagssObj);
  const htmlString = ReactDOMServer.renderToStaticMarkup(element);
  const prettified = pretty(`${docStrings[yagssObj.extension]}\n${htmlString}`);
  const destPath = path.join(destDirectory, yagssObj.relativeURL);
  return writeFilePromise(destPath, prettified);
}

function renderYagss() {
  return new Promise((resolve, reject) => {
    const hashesPath = path.join(cacheDir, 'hashed-assets.json');
    let bigObj = {};
    readFilePromise(hashesPath, 'utf8').then((contents) => {
      config.css_file = JSON.parse(contents)[config.css_file_relative];
      return globPromise(`${srcDir}/**/*.yagss`);
    })
      .then((matches) => {
        const parsePromises = matches.map(match => parseYagss(match, srcDir));
        return Promise.all(parsePromises);
      })
      .then((parsedListNoExif) => {
        // file.stem = 'sitemap';
        // file.extname = '.xml';
        // file.contents = siteMapContents(parsedListNoExif);
        return addExifData(parsedListNoExif, srcDir);
      })
      .then((parsedList) => {
        bigObj = paginate(parsedList);
        const jsEntries = getJsEntries(bigObj);
        return transpileJs(jsEntries, destDir);
      })
      .then((jsHashes) => {
        Object.keys(jsHashes).forEach((relativeURL) => {
          bigObj[relativeURL].bundledJS = jsHashes[relativeURL];
        });
        return Promise.all(Object.values(bigObj).map(item => writeYagssFile(item, destDir)));
      })
      .then(resolve);
  }).catch((error) => {
    log(error);
  });
}

function nonYagss() {
  return gulp.src(`${srcDir}/**/*.!(yagss|js|jsx|jpg)`)
    .pipe(gulp.dest(destDir));
}

function scss() {
  return gulp.src(scssPath)
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(gulpHash({ template: '<%= name %>.<%= hash %>.min<%= ext %>' }))
    .pipe(gulp.dest(destDir))
    .pipe(gulpHash.manifest('hashed-assets.json', {
      deleteOld: true,
      sourceDir: destDir,
    }))
    .pipe(gulp.dest(path.resolve(process.cwd(), config.cache_dir)));
}

function jpegVersusThumbnail(projectDir, srcFile, absSrcFile) {
  const relativePath = absSrcFile.slice(srcDir.length, -4);
  const smallestVersion = `${relativePath}-${config.img_sizes[0]}px.jpg`;
  return path.join(destDir, smallestVersion);
}

function jpegs(done) {
  gulp.src(`${srcDir}/**/*.jpg`)
    .pipe(newy(jpegVersusThumbnail))
    .pipe(responsive({
      '**/*.jpg': config.img_sizes.map(size => ({
        width: size,
        rename: { suffix: `-${size}px` },
        withoutEnlargement: false,
      })),
    }, {
      quality: 65,
      progressive: true,
      withMetadata: false,
      errorOnEnlargement: false,
    }))
    .on('error', (err) => {
      if (!err.message.startsWith('Available images do not match')) {
        log.error(err);
      }
    })
    .pipe(gulp.dest(destDir));
  done();
}

function localServer(done) {
  connect.server({
    root: destDir,
    livereload: false,
  });
  process.on('SIGINT', () => {
    connect.serverClose();
    done();
  });
}

function clean() {
  return del([
    `${path.resolve(process.cwd(), config.cache_dir)}/**/*`,
    `${destDir}/**/*`,
  ]);
}

function makeCacheDir() {
  return new Promise((resolve) => {
    fs.mkdir(cacheDir, { recursive: true }, () => {
      resolve();
    });
  });
}

const prerequisites = gulp.series([
  makeCacheDir,
  gulp.parallel([
    templates,
    scss,
  ]),
]);

const html = gulp.series([
  prerequisites,
  renderYagss,
]);

const build = gulp.parallel([
  html,
  jpegs,
  nonYagss,
]);

const buildFresh = gulp.series([clean, build]);

function watchFiles() {
  gulp.watch(`${srcDir}/**/*.(yagss|js|jsx)`, renderYagss);
  gulp.watch(`${srcDir}/**/*.(jpg)`, jpegs);
  gulp.watch(`${srcDir}/**/*.!(yagss|js|jsx|jpg)`, nonYagss);
  gulp.watch(`${parsedScssPath.dir}/**/*`, html);
  gulp.watch(`${templatesDir}/**/*`, html);
}

const serveAndWatch = gulp.parallel([localServer, watchFiles]);

exports.serve = serveAndWatch;
exports.build = build;
exports.cleanbuild = buildFresh;
exports.start = gulp.series([build, serveAndWatch]);
exports.cleanstart = gulp.series([buildFresh, serveAndWatch]);

if (require.main === module) {
  if (process.argv.length < 3) {
    log.error('yagss requires exactly one argument.');
    process.exitCode = 1;
  } else if (Object.keys(exports).includes(process.argv[2])) {
    exports[process.argv[2]]();
  } else {
    log.error('unknown argument');
  }
}
