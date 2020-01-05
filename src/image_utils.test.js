const imageUtils = require('./image_utils');

describe('imageSizePromise functionality', () => {
  it('imageSizePromise can get image dimensions', async () => {
    expect.assertions(3);
    const filePath = './test_fixtures/lincoln-1.jpg';
    const size = await imageUtils.imageSizePromise(filePath);
    expect(size.height).toBe(2750);
    expect(size.width).toBe(4141);
    expect(size.type).toBe('jpg');
  });
});

describe('metadataPromise functionality', () => {
  it('metadataPromise can parse an unsplash photo', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/sereja-ris-g3B53PbBfwU-unsplash.jpg';
    const meta = await imageUtils.metadataPromise(filePath);
    expect(meta.height).toBe(2667);
    expect(meta.width).toBe(4000);
    expect(meta.format).toBe('jpeg');
  });

  it('metadataPromise can parse a photo with an IPTC caption', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/lincoln-1.jpg';
    const meta = await imageUtils.metadataPromise(filePath);
    expect(meta.height).toBe(2750);
    expect(meta.width).toBe(4141);
    expect(meta.exif.image.Model).toBe('NIKON D90');
    expect(meta.exif.exif.LensModel).toBe('35.0 mm f/1.8');
    expect(meta.iptc.caption).toBe('A nighttime view of the Lincoln Memorial');
  });

  it('metadataPromise can parse GPS coordinates', async () => {
    expect.hasAssertions();
    const filePath = './test_fixtures/IMG_2308.jpg';
    const meta = await imageUtils.metadataPromise(filePath);
    expect(meta.height).toBe(3024);
    expect(meta.width).toBe(4032);
    expect(meta.format).toBe('jpeg');
    expect(meta.exif.image.Model).toBe('iPhone XR');
    expect(meta.exif.gps.GPSLatitudeRef).toBe('N');
    expect(meta.exif.gps.GPSLatitude[0]).toBe(43);
    expect(meta.exif.gps.GPSLongitudeRef).toBe('E');
    expect(meta.exif.gps.GPSLongitude[0]).toBe(11);
  });
});
