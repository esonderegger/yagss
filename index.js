const connect = require('gulp-connect');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const log = require('fancy-log');
const newy = require('gulp-newy');
const path = require('path');
const pretty = require('pretty');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const responsive = require('gulp-responsive');
const yaml = require('yaml');
const babelUtils = require('./src/babel_utils');
const fileUtils = require('./src/file_utils');
const imageUtils = require('./src/image_utils');
const markdownUtils = require('./src/md_utils');
const mediaUtils = require('./src/media_utils');
const siteUtils = require('./src/site_utils');
const webpackUtils = require('./src/webpack_utils');

const defaultConfig = {
  siteUrl: 'https://www.example.com',
  title: 'Hello World!',
  description: 'This is your new site made with yagss',
  srcDir: 'src',
  destDir: 'public',
  templatesDir: 'templates',
  cacheDir: '.cache',
  scssFile: 'scss/main.scss',
  imgSizes: [
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
const srcDir = path.resolve(process.cwd(), config.srcDir);
const destDir = path.resolve(process.cwd(), config.destDir);
const templatesDir = path.resolve(process.cwd(), config.templatesDir);
const cacheDir = path.resolve(process.cwd(), config.cacheDir);
const scssPath = path.resolve(process.cwd(), config.scssFile);

const parsedScssPath = path.parse(scssPath);
config.cssFileRelative = parsedScssPath.name;

const docStrings = {
  html: '<!DOCTYPE html>',
  xml: '<?xml version="1.0" encoding="utf-8" standalone="yes"?>',
};

function templates() {
  return new Promise((resolve, reject) => {
    fileUtils.globPromise(`${templatesDir}/*.jsx`).then((jsxPaths) => {
      const templatePromises = jsxPaths.map((jsxPath) => {
        const parsedPath = path.parse(jsxPath);
        const dest = path.join(cacheDir, 'templates', parsedPath.base);
        return babelUtils.transpileTemplate(jsxPath, dest);
      });
      Promise.all(templatePromises)
        .then(() => {
          log('templates rendered.');
          resolve();
        })
        .catch(reject);
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
        const filterStr = `/${parsed[k].directory}/`;
        const matches = parsedList.filter((item) => item.relativeURL.startsWith(filterStr));
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
          const sliceIndices = [i * parsed.paginate.count, (i + 1) * parsed.paginate.count];
          parsedCopy[parsed.paginate.key] = matches.slice(sliceIndices[0], sliceIndices[1]);
          for (let j = 0; j < parsedCopy[parsed.paginate.key].length; j += 1) {
            if (parsedCopy[parsed.paginate.key][j].js) {
              parsedCopy.js = parsedCopy.js.concat(parsedCopy[parsed.paginate.key][j].js);
            }
          }
          const stemIndices = [parsed.relativeDir.length + 1, -(parsed.extension.length + 1)];
          const oldStem = parsed.relativeURL.slice(stemIndices[0], stemIndices[1]);
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

function replaceXmlElements(input) {
  let output = input.replace(/<xml-link>/g, '<link>');
  output = output.replace(/<\/xml-link>/g, '</link>');
  return output;
}

function writeMdFile(yagssObj, destDirectory) {
  log(`${yagssObj.relativeDir}/${yagssObj.slug}.md => ${yagssObj.relativeURL}`);
  const templatePath = `${cacheDir}/templates/${yagssObj.template}.jsx`;
  delete require.cache[require.resolve(templatePath)];
  /* eslint-disable */
  const Template = require(templatePath);
  /* eslint-enable */
  const element = React.createElement(Template.default, yagssObj);
  let htmlString = ReactDOMServer.renderToStaticMarkup(element);
  if (yagssObj.extension === 'xml') {
    htmlString = replaceXmlElements(htmlString);
  }
  const prettified = pretty(`${docStrings[yagssObj.extension]}\n${htmlString}`);
  const destPath = path.join(destDirectory, yagssObj.relativeURL);
  return fileUtils.writeFilePromise(destPath, prettified);
}

function renderYagss() {
  return new Promise((resolve) => {
    const hashesPath = path.join(cacheDir, 'hashed-assets.json');
    let bigObj = {};
    fileUtils.readFilePromise(hashesPath, 'utf8').then((contents) => {
      config.cssFile = JSON.parse(contents)[config.cssFileRelative];
      return fileUtils.globPromise(`${srcDir}/**/*.md`);
    })
      .then((matches) => {
        const parsePromises = matches.map((match) => (
          markdownUtils.parseMdPromise(match, srcDir, config)
        ));
        return Promise.all(parsePromises);
      })
      .then((parsedListNoExif) => imageUtils.addExifData(parsedListNoExif, srcDir))
      .then((parsedListNoAudio) => mediaUtils.addAudioData(parsedListNoAudio, srcDir, destDir))
      .then((parsedList) => {
        const siteDataPath = path.join(cacheDir, 'siteData');
        return siteUtils.writeImportableSiteData(parsedList, siteDataPath);
      })
      .then((parsedList) => {
        bigObj = paginate(parsedList);
        const jsEntries = getJsEntries(bigObj);
        return webpackUtils.transpileJs(jsEntries, destDir);
      })
      .then((jsHashes) => {
        Object.keys(jsHashes).forEach((relativeURL) => {
          bigObj[relativeURL].bundledJS = jsHashes[relativeURL];
        });
        return Promise.all(Object.values(bigObj).map((item) => writeMdFile(item, destDir)));
      })
      .then(resolve);
  }).catch((error) => {
    log(error);
  });
}

function nonYagss() {
  return gulp.src(`${srcDir}/**/*.!(md|js|jsx|jpg|wav|mp3)`)
    .pipe(gulp.dest(destDir));
}

async function scss() {
  const hashes = await webpackUtils.transpileScss(scssPath, destDir, process.env.NODE_ENV === 'production');
  const hashesPath = path.join(cacheDir, 'hashed-assets.json');
  return fileUtils.writeFilePromise(hashesPath, JSON.stringify(hashes, null, 2), {});
}

function jpegVersusThumbnail(projectDir, srcFile, absSrcFile) {
  const relativePath = absSrcFile.slice(srcDir.length, -4);
  const smallestVersion = `${relativePath}-${config.imgSizes[0]}px.jpg`;
  return path.join(destDir, smallestVersion);
}

function jpegs(done) {
  gulp.src(`${srcDir}/**/*.jpg`)
    .pipe(newy(jpegVersusThumbnail))
    .pipe(responsive({
      '**/*.jpg': config.imgSizes.map((size) => ({
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

async function encodeAudio() {
  const matches = await fileUtils.globPromise(`${srcDir}/**/*.{wav,mp3}`);
  const encodes = matches.map((match) => {
    const relativePath = match.slice(srcDir.length);
    const encodeDest = path.dirname(`${destDir}${relativePath}`);
    return mediaUtils.r128encode(match, encodeDest);
  });
  const outputs = await Promise.all(encodes);
  return outputs;
}

function localServer(done) {
  connect.server({
    root: destDir,
    port: process.env.PORT || 8000,
    livereload: Boolean(process.env.LIVE_RELOAD),
  });
  process.on('SIGINT', () => {
    connect.serverClose();
    done();
  });
}

function clean() {
  return del([
    `${path.resolve(process.cwd(), config.cacheDir)}/**/*`,
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
    encodeAudio,
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
  gulp.watch(`${srcDir}/**/*.(md|js|jsx)`, renderYagss);
  gulp.watch(`${srcDir}/**/*.(jpg)`, jpegs);
  gulp.watch(`${srcDir}/**/*.!(md|js|jsx|jpg)`, nonYagss);
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
