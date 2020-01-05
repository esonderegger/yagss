const fileUtils = require('./file_utils');

describe('readFilePromise functionality', () => {
  it('readFilePromise can read a file', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/basic.md';
    const data = await fileUtils.readFilePromise(filePath, 'utf8');
    expect(typeof data).toBe('string');
  });
});

describe('globPromise functionality', () => {
  it('globPromise can read a directory', async () => {
    expect.hasAssertions();
    const dirPath = './test_fixtures/**/*.jpg';
    const matches = await fileUtils.globPromise(dirPath);
    expect(Array.isArray(matches)).toBe(true);
    expect(matches).toHaveLength(3);
  });
});
