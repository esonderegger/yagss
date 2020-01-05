const sizeOf = require('image-size');
const path = require('path');
const sharp = require('sharp');
const exifReader = require('exif-reader');
const iptcReader = require('iptc-reader');

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
  return new Promise((resolve) => {
    const exifPromises = [];
    parsedList.forEach((item) => {
      if (item.images) {
        item.images.forEach((image) => {
          const imgDir = path.join(baseDir, item.relativeDir, image.filename);
          const filePath = `${imgDir}.jpg`;
          // const addExif = new Promise((resv) => {
          //   exifPromise(filePath).then((exifData) => {
          //     /* eslint-disable */
          //     image.exif = exifData;
          //     /* eslint-enable */
          //     resv();
          //   });
          // });
          const addSize = new Promise((resv) => {
            imageSizePromise(filePath).then((dimensions) => {
              /* eslint-disable */
              image.size = dimensions;
              /* eslint-enable */
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
