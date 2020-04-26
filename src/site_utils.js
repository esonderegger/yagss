const fileUtils = require('./file_utils');

function importableSiteData(entry) {
  const doNotInclude = [
    'srcDir',
    'destDir',
    'cacheDir',
    'templatesDir',
    'scssFile',
    'cssFile',
    'js',
    'content',
  ];
  const filteredKeys = Object.keys(entry).filter((k) => !doNotInclude.includes(k));
  const jsLines = filteredKeys.map((k) => {
    const stringified = JSON.stringify(entry[k]);
    return `export const ${k} = ${stringified};\n`;
  });
  return jsLines.join('\n');
}

async function writeImportableSiteData(siteData, rootPath) {
  const contents = siteData.map(importableSiteData);
  const outPaths = siteData.map((entry) => `${rootPath}${entry.relativeDir}/${entry.slug}.js`);
  const writePromises = outPaths.map((p, i) => fileUtils.writeFilePromise(p, contents[i]));
  await Promise.all(writePromises);
  return siteData;
}

module.exports = {
  writeImportableSiteData,
};
