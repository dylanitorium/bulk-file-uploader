const files = require('../utils/files');
const log = require('../utils/log');
const upload = require('../utils/upload');
const { loadConfiguration } = require('./config');

const BATCH_SIZE = 10;


const execute = async (dir, command) => (
  new Promise(async (reject, resolve) => {
    const { bucket } = await loadConfiguration();
    
    const uploadBatch = async (batch) => {
      return Promise.all(batch.map((path) => {
        return  upload({ path, bucket, reupload: command.parent.reupload })
      }));  
    };
    
    let paths = [];
    try {
      paths = await files(dir);
    } catch (e) {
      log(`Error reading directory: ${dir}`)
    }
    
    
    const fileCount = paths.length;
    const batches = [];
    
    log(`${fileCount} files to be uploaded in batches of ${BATCH_SIZE}`);
    
    while (paths.length) {
      log('=============================');
      log('====== Uploading Batch ======');
      log('=============================');
      const batch = paths.splice(0, BATCH_SIZE);
      await uploadBatch(batch);
    }
    
  })
);

module.exports = execute;