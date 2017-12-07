const AWS = require('aws-sdk');
const fs = require('fs');
const { PassThrough } = require('stream');
const log = require('./log');

// Configure AWS
AWS.config.update({
  region: 'ap-southeast-2',
});

const s3 = new AWS.S3();


const checkFile = async (key, bucket) => {
  return new Promise(async (resolve, reject) => {
    s3.headObject({
      Key: key,
      Bucket: bucket
    }, (error) =>  {  
      if (error && error.code === 'NotFound') {  
        resolve(false);
      }
      
      return resolve(true);
    });
  });
};

/**
 * @param path String path to file
 * @return string The file name
 */
const getFileName = path => path.split('/').pop();

/**
 * @param path String path to file to upload
 * @param bucket String s3 Bucket to upload to 
 */
const upload = async ({ path, bucket, reupload }) => (
  new Promise(async (resolve, reject) => {
    const key = getFileName(path);
    const s3ObjectExists = await checkFile({ key, bucket });
    
    if (s3ObjectExists && !reupload) {
      log(`${key}: file already exists in S3, to reupload use the --reupload option`);
      return resolve(path);
    }
    
    log(`${key}: uploading...`);
    
    // This is declared in the scope of the promise so it
    // can use the promises reject
    const handleStreamError = error => reject(error);
    
    // This is declared in the scope of the promise just for consistency
    const handleUploadProgress = data => log(`${filkeyeName}: ${data.loaded} bytes uploaded...`);
    
    // This will take a read stream and put out a write stream - a stream like this called
    // a duplex stream
    const duplexStream = new PassThrough();
    
    // Open a a read strem from the file 
    const readStream = fs.createReadStream(path);
    
    // Pipe the stream into our duplex
    readStream.pipe(duplexStream);
    
    // Handle any stream errors
    readStream.on('error', handleStreamError);
    duplexStream.on('error', handleStreamError);
    
    // Create an upload object
    const upload = s3.upload({
      Bucket: bucket,
      Key: key,
      Body: duplexStream
    });

     upload.on('httpUploadProgress', handleUploadProgress);
    
    // Send the upload to S3. This callback will run once the upload closes.
    upload.send((error) => {
      if (error) {
        return reject(error);
      }
      
      log(`${key}: upload complete`);
      return resolve(path);
    });
  })
);

module.exports = upload;