const babel = require('@babel/core');
const log = require('fancy-log');
const fileUtils = require('./file_utils');

function transpileTemplate(srcPath, destPath) {
  return new Promise((resolve, reject) => {
    const babelOptions = {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    };
    const babelCb = (err, result) => {
      if (err) {
        log(err);
        reject(err);
      } else {
        fileUtils.writeFilePromise(destPath, result.code)
          .then(() => resolve(result));
      }
    };
    fileUtils.readFilePromise(srcPath, 'utf8').then((fileContents) => {
      babel.transform(fileContents, babelOptions, babelCb);
    });
  });
}

module.exports = {
  transpileTemplate,
};
