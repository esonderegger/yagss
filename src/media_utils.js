const childProcess = require('child_process');
const ffprobe = require('ffprobe');
const fs = require('fs');
const path = require('path');
const fileUtils = require('./file_utils');

function probe(filePath) {
  const ffProbePath = path.join(__dirname, '..', 'binaries', 'ffprobe');
  return ffprobe(filePath, { path: ffProbePath });
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
  const ffmpegPath = path.join(__dirname, '..', 'binaries', 'ffmpeg');
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
  const proc = childProcess.spawn(ffmpegPath, ffArgs);
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
  const ffmpegPath = path.join(__dirname, '..', 'binaries', 'ffmpeg');
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
    const proc = childProcess.spawn(ffmpegPath, ffArgs);
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
  const ffmpegPath = path.join(__dirname, '..', 'binaries', 'ffmpeg');
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
    const proc = childProcess.spawn(ffmpegPath, ffArgs);
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
    const mp3GlobPattern = `${path.join(baseDir, item.relativeDir)}/*.{wav,mp3}`;
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
    item.audio = combined;
    return item;
  });
  return Promise.all(mp3Promises);
}

module.exports = {
  probe,
  r128Stats,
  r128encode,
  addAudioData,
};
