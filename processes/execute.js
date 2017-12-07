const files = require('../utils/files');
const log = require('../utils/log');
const upload = require('../utils/upload');
const { loadConfiguration } = require('./config');

const execute = async (dir, command) => (
  new Promise(async (reject, resolve) => {
    const { bucket } = await loadConfiguration();
    let paths = [];
    try {
      paths = await files(dir);
    } catch (e) {
      log(`Error reading directory: ${dir}`)
    }
    paths.forEach((path) => {
      try {
        upload({ path, bucket, reupload: command.parent.reupload })
      } catch (e) {
        log(`Error uploading file: ${path}`)
      }
    });
  })
);

module.exports = execute;