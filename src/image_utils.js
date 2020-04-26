const sizeOf = require('image-size');
const path = require('path');
const sharp = require('sharp');
const exifReader = require('exif-reader');
const iptcReader = require('iptc-reader');
const fileUtils = require('./file_utils');

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

function metadataPromise(filePath) {
  return new Promise((resolve, reject) => {
    sharp(filePath)
      .metadata()
      .then((meta) => {
        const keysToExclude = ['exif', 'icc', 'iptc', 'xmp'];
        const combined = Object.keys(meta).reduce((acc, ele) => {
          const pair = {};
          if (!keysToExclude.includes(ele)) {
            pair[ele] = meta[ele];
          }
          return Object.assign(acc, pair);
        }, {});
        combined.filename = path.parse(filePath).name;
        try {
          combined.exif = exifReader(meta.exif);
        } catch (err) {
          combined.exif = err;
        }
        try {
          combined.iptc = iptcReader(meta.iptc);
        } catch (err) {
          combined.iptc = err;
        }
        resolve(combined);
      })
      .catch(reject);
  });
}

function addExifData(parsedList, baseDir) {
  const exifPromises = parsedList.map((item) => {
    const jpgGlobPattern = `${path.join(baseDir, item.relativeDir)}/*.jpg`;
    return new Promise((resolve) => {
      fileUtils.globPromise(jpgGlobPattern).then((jpgMatches) => {
        const metaPromises = jpgMatches.map(metadataPromise);
        return Promise.all(metaPromises);
      }).then((metaEntries) => {
        // eslint-disable-next-line no-param-reassign
        item.images = metaEntries;
        resolve(item);
      });
    });
  });
  return Promise.all(exifPromises);
}

function addMetadata(parsedList, baseDir) {
  return new Promise((resolve) => {
    const metaPromises = [];
    parsedList.forEach((item) => {
      if (item.images) {
        item.images.forEach((image) => {
          const imgDir = path.join(baseDir, item.relativeDir, image.filename);
          const filePath = `${imgDir}.jpg`;
          const addMeta = new Promise((resv) => {
            metadataPromise(filePath).then((meta) => {
              /* eslint-disable */
              image.metadata = meta;
              /* eslint-enable */
              resv();
            });
          });
          // exifPromises.push(addExif);
          metaPromises.push(addMeta);
        });
      }
    });
    Promise.all(metaPromises).then(() => {
      resolve(parsedList);
    });
  });
}

module.exports = {
  imageSizePromise,
  metadataPromise,
  addExifData,
  addMetadata,
};
