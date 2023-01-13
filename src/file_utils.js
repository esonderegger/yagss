const fs = require('fs');
const glob = require('glob');
const path = require('path');

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
                  resolve(data);
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

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.promises.access(dirPath);
  } catch (error) {
    console.log('catching fs error', error);
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
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

module.exports = {
  readFilePromise,
  ensureDirectoryExists,
  writeFilePromise,
  globPromise,
};
