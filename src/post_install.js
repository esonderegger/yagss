const ffbinaries = require('ffbinaries');
const log = require('fancy-log');
const path = require('path');

// const dest = `${__dirname}/binaries`;
const dest = path.join(__dirname, '..', 'binaries');
// const dest = path.join(process.cwd(), 'binaries');

ffbinaries.downloadBinaries(['ffmpeg', 'ffprobe'], { quiet: true, destination: dest }, () => {
  log('Downloaded ffplay and ffprobe binaries for this platform');
});
