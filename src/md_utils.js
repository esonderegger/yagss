const marked = require('marked');
const path = require('path');
const yaml = require('yaml');
const sectionMatter = require('section-matter');
const fileUtils = require('./file_utils');

function jsList(unknownInput, baseDir) {
  if (Array.isArray(unknownInput)) {
    return unknownInput.map((item) => path.resolve(baseDir, item));
  }
  if (unknownInput && typeof unknownInput === 'string') {
    return [path.resolve(baseDir, unknownInput)];
  }
  return [];
}

function parseMdPromise(filePath, baseDir, config) {
  return new Promise((resolve, reject) => {
    fileUtils.readFilePromise(filePath, 'utf8').then((f) => {
      try {
        const parsed = {};
        Object.assign(parsed, config, sectionMatter(f));
        parsed.content = marked.marked(parsed.content, { smartypants: true });
        for (let i = 0; i < parsed.sections.length; i += 1) {
          const section = parsed.sections[i];
          section.content = marked.marked(section.content, {
            smartypants: true,
          });
          const data = yaml.parse(section.data);
          Object.assign(section, data);
          delete section.data;
        }
        if (parsed.sections.length > 0) {
          Object.assign(parsed, parsed.sections[0]);
        }
        if (!parsed.extension) {
          parsed.extension = 'html';
        }
        const parsedPath = path.parse(filePath);
        const relativeDir = parsedPath.dir.slice(baseDir.length);
        parsed.js = jsList(parsed.js, parsedPath.dir);
        parsed.slug = parsedPath.name;
        parsed.relativeDir = relativeDir;
        parsed.relativeURL = `${relativeDir}/${parsedPath.name}.${parsed.extension}`;
        parsed.url = `${parsed.siteUrl}${parsed.relativeURL}`;
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
}

module.exports = {
  parseMdPromise,
};
