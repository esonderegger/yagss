const childProcess = require('child_process');
const ffprobe = require('ffprobe');
const fs = require('fs');
const path = require('path');
const fileUtils = require('./file_utils');

function probe(filePath) {
  const ffProbePath = path.join(__dirname, '..', 'binaries', 'ffprobe');
  return ffprobe(filePath, { path: ffProbePath });
}

function ffmpegPath() {
  return path.join(__dirname, '..', 'binaries', 'ffmpeg');
}

function parseR128(errText) {
  const summaryIndex = errText.indexOf('Summary:');
  if (summaryIndex > 0) {
    const summaryText = errText.slice(summaryIndex);
    const summaryLines = summaryText.split('\n');
    const relevantLines = summaryLines.filter((line) => {
      const parts = line.split(':');
      if (parts.length < 2 || parts[1].trim().length === 0) {
        return false;
      }
      return true;
    });
    const lineFloats = relevantLines.map((line) => {
      const parts = line.split(' ');
      return parseFloat(parts[parts.length - 2]);
    });
    const r128Keys = [
      'i',
      'iThreshold',
      'lra',
      'lraThreshold',
      'lraLow',
      'lraHigh',
      'peak',
    ];
    const result = {};
    r128Keys.forEach((k, i) => {
      result[k] = lineFloats[i];
    });
    return result;
  }
  return null;
}

function r128Stats(filePath) {
  const ffArgs = [
    '-nostats',
    '-i',
    filePath,
    '-filter_complex',
    'ebur128=peak=true',
    '-f',
    'null',
    '-',
  ];
  const proc = childProcess.spawn(ffmpegPath(), ffArgs);
  let results = null;
  proc.stderr.on('data', (data) => {
    const stats = parseR128(data.toString());
    if (stats) {
      results = stats;
    }
  });
  return new Promise((resolve) => {
    proc.on('close', () => {
      resolve(results);
    });
  });
}

function r128Pass1(filePath) {
  const ffArgs = [
    '-i',
    filePath,
    '-af',
    'loudnorm=I=-18:TP=-1.0:LRA=9:print_format=json',
    '-f',
    'null',
    '-',
  ];
  return new Promise((resolve) => {
    const proc = childProcess.spawn(ffmpegPath(), ffArgs);
    let stderrText = null;
    proc.stderr.on('data', (data) => {
      stderrText += data;
    });
    proc.on('exit', () => {
      const jsonStartIndex = stderrText.lastIndexOf('{');
      const jsonString = stderrText.slice(jsonStartIndex);
      resolve(JSON.parse(jsonString));
    });
  });
}

function r128Pass2(srcPath, loudnessInfo, outPath) {
  const afString = `measured_I=${loudnessInfo.input_i}:measured_LRA=${loudnessInfo.input_lra}:measured_TP=${loudnessInfo.input_tp}:measured_thresh=${loudnessInfo.input_thresh}:offset=${loudnessInfo.target_offset}:linear=true:print_format=summary`;
  const ffArgs = [
    '-i',
    srcPath,
    '-af',
    `loudnorm=I=-18:TP=-1.0:LRA=9:${afString}`,
    '-codec:a',
    'libmp3lame',
    '-b:a',
    '192k',
    outPath,
  ];
  return new Promise((resolve) => {
    const proc = childProcess.spawn(ffmpegPath(), ffArgs);
    proc.on('close', () => {
      resolve(outPath);
    });
  });
}

async function r128encode(srcPath, destDir) {
  const outPath = path.join(destDir, `${path.parse(srcPath).name}.mp3`);
  if (!fs.existsSync(path.resolve(destDir))) {
    await fs.promises.mkdir(destDir, { recursive: true });
  }
  const alreadyExists = fs.existsSync(path.resolve(outPath));
  if (!alreadyExists) {
    const loudnessInfo = await r128Pass1(srcPath);
    await r128Pass2(srcPath, loudnessInfo, outPath);
  }
  return outPath;
}

function addAudioData(parsedList, baseDir, destDir) {
  const mp3Promises = parsedList.map(async (item) => {
    const mp3GlobPattern = `${path.join(
      baseDir,
      item.relativeDir
    )}/*.{wav,mp3}`;
    const mp3Matches = await fileUtils.globPromise(mp3GlobPattern);
    const probes = mp3Matches.map(probe);
    const probeResults = await Promise.all(probes);
    const destPaths = mp3Matches.map((match) => {
      const relativeDir = path.parse(match).dir.slice(baseDir.length);
      return `${destDir}${relativeDir}/${path.parse(match).name}.mp3`;
    });
    const stats = await Promise.all(destPaths.map(fs.promises.stat));
    const combined = mp3Matches.map((match, i) => {
      const fileStats = stats[i];
      const encodedSize = fileStats.size;
      return {
        name: `${path.parse(match).name}.mp3`,
        originalName: path.basename(match),
        probe: probeResults[i],
        encodedSize,
      };
    });
    // eslint-disable-next-line no-param-reassign
    item.audios = combined;
    return item;
  });
  return Promise.all(mp3Promises);
}

function magicBitrate(width, height) {
  const p = width * height;
  return Math.max(p * 0.0008 + p ** 0.19 * 425 - 3600, p * 0.0008);
}

function streamFfArgs(stream, outputPath) {
  return [
    '-vf',
    `scale=w=${stream.width}:h=${stream.height}:force_original_aspect_ratio=decrease`,
    '-sn',
    '-c:a',
    'aac',
    '-ar',
    '48000',
    '-pix_fmt',
    'yuv420p',
    '-c:v',
    'libx264',
    '-profile:v',
    'main',
    '-crf',
    '20',
    '-sc_threshold',
    '0',
    '-g',
    '48',
    '-keyint_min',
    '48',
    '-hls_time',
    '4',
    '-hls_playlist_type',
    'vod',
    '-b:v',
    `${stream.bitrate}k`,
    '-maxrate',
    `${Math.round(stream.bitrate * 1.07)}k`,
    '-bufsize',
    `${Math.round(stream.bitrate * 1.5)}k`,
    '-b:a',
    '96k',
    '-hls_segment_filename',
    `${outputPath}/${stream.height}p_%03d.ts`,
    `${outputPath}/${stream.height}p.m3u8`,
  ];
}

function applicableStreams(streams, probeResults) {
  const videoStream = probeResults.streams.find(
    (s) => s.codec_type === 'video'
  );
  const aspect = videoStream.width / videoStream.height;
  const heights = streams.height
    ? streams.height
    : streams.width.map((s) => s / aspect);
  const notUpscaled = heights.filter((s) => videoStream.height >= s);
  const theStreams = notUpscaled.map((s) => {
    const height = s;
    const width = height * aspect;
    const bitrate = Math.round(magicBitrate(width, height));
    return { height, width, bitrate };
  });
  theStreams.sort((a, b) => b.bitrate - a.bitrate);
  return theStreams;
}

function indexManifest(videoStreams, captionStreams) {
  const manifestLines = ['#EXTM3U', '#EXT-X-VERSION:3'];
  captionStreams.forEach((s, i) => {
    const captionArgs = [
      '#EXT-X-MEDIA:TYPE=SUBTITLES',
      'GROUP-ID="cc"',
      `NAME="${s.languageName}"`,
      `LANGUAGE="${s.languageCode}"`,
      `AUTOSELECT=${i === 0 ? 'YES' : 'NO'}`,
      `DEFAULT=${i === 0 ? 'YES' : 'NO'}`,
      `URI="cc${i}.m3u8"`,
    ];
    manifestLines.push(captionArgs.join(','));
  });
  videoStreams.forEach((s) => {
    const videoArgs = [
      `#EXT-X-STREAM-INF:BANDWIDTH=${s.bitrate}000`,
      `RESOLUTION=${s.width}x${s.height}`,
    ];
    manifestLines.push(videoArgs.join(','));
    manifestLines.push(`${s.height}p.m3u8`);
  });
  manifestLines.push('');
  return manifestLines.join('\n');
}

function doVideoEncode(inputFile, streams, outputPath, log) {
  const outputArgs = streams.map((stream) => streamFfArgs(stream, outputPath));
  const ffArgs = ['-hide_banner', '-y', '-i', inputFile].concat(...outputArgs);
  const indexText = indexManifest(streams, []);
  const proc = childProcess.spawn(ffmpegPath(), ffArgs);
  proc.stdout.on('data', (data) => log(data.toString()));
  proc.stderr.on('data', (data) => log(data.toString()));
  return new Promise((resolve, reject) => {
    proc.on('close', () => {
      fs.writeFile(`${outputPath}/index.m3u8`, indexText, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(`${outputPath}/index.m3u8`);
        }
      });
    });
  });
}

// function videoEncode(inputFile, streams, outputPath) {
//   return new Promise((resolve, reject) => {
//     ffprobe(inputFile, { path: 'ffprobe' })
//       .then((probeResults) => {
//         const calcStreams = applicableStreams(streams, probeResults);
//         return doVideoEncode(inputFile, calcStreams, outputPath);
//       })
//       .then((indexManifestPath) => {
//         resolve(indexManifestPath);
//       })
//       .catch((err) => reject(err));
//   });
// }

async function videoEncode(srcPath, streams, destDir, log) {
  const outDir = path.join(destDir, path.parse(srcPath).name);
  const outPath = path.join(outDir, 'index.m3u8');
  if (!fs.existsSync(path.resolve(outDir))) {
    await fs.promises.mkdir(outDir, { recursive: true });
  }
  const alreadyExists = fs.existsSync(path.resolve(outPath));
  if (!alreadyExists) {
    const probeResults = await probe(srcPath);
    const calcStreams = applicableStreams(streams, probeResults);
    await doVideoEncode(srcPath, calcStreams, outDir, log);
  }
  return outPath;
}

function addVideoData(parsedList, baseDir) {
  const videoPromises = parsedList.map(async (item) => {
    const videoGlobPattern = `${path.join(
      baseDir,
      item.relativeDir
    )}/*.{mov, mp4}`;
    const videoMatches = await fileUtils.globPromise(videoGlobPattern);
    const probes = videoMatches.map(probe);
    const probeResults = await Promise.all(probes);
    // const destPaths = videoMatches.map((match) => {
    //   const relativeDir = path.parse(match).dir.slice(baseDir.length);
    //   return `${destDir}${relativeDir}/${path.parse(match).name}/index.m3u8`;
    // });
    const combined = videoMatches.map((match, i) => {
      const parsed = path.parse(match);
      const relativeDir = parsed.dir.slice(baseDir.length);
      return {
        name: `${parsed.name}`,
        hlsUrl: `${relativeDir}/${parsed.name}/index.m3u8`,
        originalName: path.basename(match),
        probe: probeResults[i],
      };
    });
    // eslint-disable-next-line no-param-reassign
    item.videos = combined;
    return item;
  });
  return Promise.all(videoPromises);
}

module.exports = {
  probe,
  r128Stats,
  r128encode,
  addAudioData,
  videoEncode,
  addVideoData,
};
