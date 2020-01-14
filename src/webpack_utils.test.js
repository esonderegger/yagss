const del = require('del');
const path = require('path');
const webpackUtils = require('./webpack_utils');

async function deleteTestDestination() {
  await del([path.resolve(__dirname, '../test_destination')]);
}

describe('transpileJs', () => {
  beforeAll(deleteTestDestination);
  afterAll(deleteTestDestination);

  it('transpileJs can transpile a simple react component', async () => {
    expect.hasAssertions();
    const entries = ['../test_fixtures/basic.jsx'];
    const jsEntries = entries.map(entry => path.resolve(__dirname, entry));
    const destDir = path.resolve(__dirname, '../test_destination');
    const data = await webpackUtils.transpileJs(jsEntries, destDir);
    expect(typeof data).toBe('object');
    expect(Array.isArray(data.main)).toBe(true);
  });
});

describe('transpileScss', () => {
  beforeAll(deleteTestDestination);
  afterAll(deleteTestDestination);

  it('transpileScss can transpile a file with imports', async () => {
    expect.hasAssertions();
    const entry = '../test_fixtures/scss/main.scss';
    const scssEntry = path.resolve(__dirname, entry);
    const destDir = path.resolve(__dirname, '../test_destination');
    const data = await webpackUtils.transpileScss(scssEntry, destDir);
    expect(typeof data).toBe('object');
    expect(typeof data.main).toBe('string');
  });
});
