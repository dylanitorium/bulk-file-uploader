const fs = require('fs');



/**
 * Returns an array of files in a directory
 * @param dir String The path to the directory
 * @return Promise<Array>
 */
const files = async (dir) => (
  new Promise((resolve, reject) => {
    // Declared in function to have access to dir parameter
    const concatenateDir = file => dir + file;
    
    fs.readdir(dir, (error, files) => {
      if (error) {
        return reject(error);
      }
      
      const filesWithAbsolutePath = files.map(concatenateDir);
      
      return resolve(filesWithAbsolutePath);
    })
  })
);

module.exports = files;