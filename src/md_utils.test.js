const mdUtils = require('./md_utils');

const dummyConfig = {
  site_url: 'https://example.rpy.xyz',
  title: 'Example Site',
  description: 'This is a deafult that would get overwritten',
};

describe('parseMdPromise functionality', () => {
  it('readFilePromise can read a basic file', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/basic.md';
    const data = await mdUtils.parseMdPromise(filePath, process.cwd(), dummyConfig);
    expect(typeof data).toBe('object');
    expect(data.template).toBe('Simple');
  });

  it('readFilePromise can read a file without front-matter', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/no_front_matter.md';
    const data = await mdUtils.parseMdPromise(filePath, process.cwd(), dummyConfig);
    expect(typeof data).toBe('object');
    expect(data.slug).toBe('no_front_matter');
    expect(data.relativeURL).toBe('/no_front_matter.html');
    expect(data.url).toBe('https://example.rpy.xyz/no_front_matter.html');
    expect(data.content.indexOf('“in quotes”')).toBeGreaterThan(0);
  });

  it('readFilePromise can read a multi-section file', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/multi_section.md';
    const data = await mdUtils.parseMdPromise(filePath, process.cwd(), dummyConfig);
    expect(typeof data).toBe('object');
    expect(data.sections).toHaveLength(2);
    expect(data.sections[1].component).toBe('ImageFigure');
  });
});
