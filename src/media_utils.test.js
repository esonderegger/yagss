const fs = require('fs');
const path = require('path');
const audioUtils = require('./media_utils');

describe('probe functionality', () => {
  it('probe can get audio data', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/marines_hymn.mp3';
    const probeResults = await audioUtils.probe(filePath);
    expect(probeResults.streams).toHaveLength(2);
    const audioStream = probeResults.streams.find((s) => s.codec_type === 'audio');
    expect(!!audioStream).toBe(true);
    expect(audioStream.codec_name).toBe('mp3');
  });
});

describe('r128Stats functionality', () => {
  it('r128Stats can read an mp3 file', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/marines_hymn.mp3';
    const results = await audioUtils.r128Stats(filePath);
    expect(typeof results).toBe('object');
    expect(results.i).toBe(-13.3);
    expect(results.peak).toBe(0.2);
  });
});

describe('r128encode functionality', () => {
  beforeAll(async () => {
    if (!fs.existsSync('test_encodes')) {
      await fs.promises.mkdir('test_encodes');
    }
    const contents = await fs.promises.readdir('test_encodes');
    const deletions = contents.map((item) => fs.promises.unlink(path.join('test_encodes', item)));
    await Promise.all(deletions);
  });

  afterAll(async () => {
    const contents = await fs.promises.readdir('test_encodes');
    const deletions = contents.map((item) => fs.promises.unlink(path.join('test_encodes', item)));
    await Promise.all(deletions);
    await fs.promises.rmdir('test_encodes');
  });

  it('r128encode can encode an mp3', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/marines_hymn.mp3';
    const outPath = await audioUtils.r128encode(filePath, './test_encodes');
    expect(typeof outPath).toBe('string');
    expect(outPath).toBe('test_encodes/marines_hymn.mp3');
    const results = await audioUtils.r128Stats(outPath);
    expect(typeof results).toBe('object');
    expect(results.i).toBeCloseTo(-18, 0);
  });

  it('r128encode can encode a wav', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/BoringPodcast1.wav';
    const outPath = await audioUtils.r128encode(filePath, './test_encodes');
    expect(typeof outPath).toBe('string');
    expect(outPath).toBe('test_encodes/BoringPodcast1.mp3');
    const results = await audioUtils.r128Stats(outPath);
    expect(typeof results).toBe('object');
    expect(results.i).toBeCloseTo(-18, 0);
  });
});
