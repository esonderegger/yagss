const del = require('del');
const fs = require('fs');
const path = require('path');
const babelUtils = require('./babel_utils');

async function deleteTestDestination() {
  await del([path.resolve(__dirname, '../test_destination')]);
}

describe('transpileTemplate', () => {
  beforeAll(deleteTestDestination);
  afterAll(deleteTestDestination);

  it('transpileTemplate can transpile a simple react template', async () => {
    expect.hasAssertions();
    const src = path.resolve(__dirname, '../test_fixtures/basic.jsx');
    const destDir = path.resolve(__dirname, '../test_destination');
    const destPath = path.join(destDir, 'basic.jsx');
    const data = await babelUtils.transpileTemplate(src, destPath);
    const dirContents = fs.readdirSync(destDir);
    expect(dirContents).toHaveLength(1);
    expect(dirContents).toContain('basic.jsx');
    expect(typeof data).toBe('object');
    expect(data.code.startsWith('"use strict"')).toBe(true);
  });
});
