const fs = require('fs');
const path = require('path');
const os = require('os');
const prompt = require('prompt');

const CONFIG_FILE = path.resolve(os.homedir(), '.bfurc');

const DEFAULT_CONFIG =  {
  bucket: 'none',
  dynamoDbTable: 'none',
};

const configurationFileExists = async () => {
  return new Promise(async (resolve, reject) => {
    fs.access(CONFIG_FILE, fs.constants.R_OK, (error) => {
      if (error) {
        return resolve(false);
      }
      
      return resolve(true);
    })
  });
};


const loadConfiguration = async () => {
  return new Promise(async (resolve, reject) => {
    const configExists = await configurationFileExists();
    if (!configExists) {
      return resolve(DEFAULT_CONFIG);
    }
    
    const data = fs.readFile(CONFIG_FILE, 'utf8', (error, data) => {
      if (error) {
        return reject(error);
      }
      
      const file = JSON.parse(data);
      
      return resolve(file);
    });
    
  });
};

/**
 * Prompt the user to enter config
 */
const getUserConfig = async (config) => {
  return new Promise(async (resolve, reject) => {
    prompt.start();
    prompt.get({
      properties: {
        bucket: {
          message: `S3 Bucket [${config.bucket}]`,
        },
        dynamoDbTable: {
          message: `DynamoDB Table [${config.dynamoDbTable}]`,
        },
      }
    }, (error, result) => {
      if (error) {
        return reject(error);
      }
      
      return resolve(result);
    });
  });
}


const filterUserConfig = (config) => {
  const filtered = {};
  for (let key in config) {
    if (config.hasOwnProperty(key)) {
      if (config[key] && config[key] !== '') {
        filtered[key] = config[key];
      }
    }
  }
  return filtered;
}


/**
 * Configure the application
 */
const configure = async () => {
  return new Promise(async (resolve, reject) => {
    const config = await loadConfiguration();
    const userConfig = await getUserConfig(config);
    const updatedConfig = {
      ...config,
      ...filterUserConfig(userConfig)
    };
      
    fs.writeFile(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2), (error) => {
      if (error) {
        return reject(error);
      }
      
      return resolve(updatedConfig);
    })
  });
};

module.exports = {
  configure,
  loadConfiguration,
}