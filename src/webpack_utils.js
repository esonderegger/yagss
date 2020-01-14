const crypto = require('crypto');
const log = require('fancy-log');
const nodeSass = require('node-sass');
const path = require('path');
const webpack = require('webpack');
const fileUtils = require('./file_utils');

function transpileJs(entries, outputPath) {
  const envMode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const config = {
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
  };
  return new Promise((resolve, reject) => {
    if (Object.keys(entries).length === 0) {
      resolve({});
    } else {
      webpack(config, (err, stats) => {
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
            const epFiles = ep.chunks.reduce((acc, val) => {
              val.files.forEach((f) => {
                acc.add(f);
              });
              return acc;
            }, new Set());
            const withSlashes = Array.from(epFiles).map(f => path.join('/', f));
            resolutionObj[ep.options.name] = withSlashes;
          });
          resolve(resolutionObj);
        }
      });
    }
  });
}

function transpileScss(entry, outputDir, prodMode) {
  const entryDir = path.dirname(entry);
  const entryBase = path.basename(entry, '.scss');
  return new Promise((resolve, reject) => {
    nodeSass.render({
      file: entry,
      outFile: path.join(entryDir, `${entryBase}.css`),
      outputStyle: prodMode ? 'compressed' : 'nested',
      sourceMap: !prodMode,
    }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const cssHash = crypto.createHash('md5').update(result.css).digest('hex').slice(0, 8);
        const outputFileName = `${entryBase}.${cssHash}.css`;
        const outputPath = path.join(outputDir, outputFileName);
        const cssPromises = [fileUtils.writeFilePromise(outputPath, result.css, {})];
        if (!prodMode) {
          const mapPath = path.join(outputDir, `${entryBase}.css.map`);
          cssPromises.push(fileUtils.writeFilePromise(mapPath, result.map, {}));
        }
        const resolutionObj = {};
        resolutionObj[entryBase] = outputFileName;
        Promise.all(cssPromises).then(() => resolve(resolutionObj));
      }
    });
  });
}

module.exports = {
  transpileJs,
  transpileScss,
};
