const AWS = require('aws-sdk');
const fs = require('fs');
const { json2csv } = require('json-2-csv');
const log = require('../utils/log');
const { loadConfiguration } = require('./config');

// Configure AWS
AWS.config.update({
  region: 'ap-southeast-2',
});

const dynamodb = new AWS.DynamoDB();


const getRecords = async (startKey) => {
  return new Promise(async (resolve, reject) => {
    const { dynamoDbTable } = await loadConfiguration();
    const params = {
      TableName: dynamoDbTable,
      ExclusiveStartKey: startKey,
    };
    
    dynamodb.scan(params, (error, data) => {
      if (error) {
        return reject(error);
      }
      
      return resolve(data);
    })
  });
};

const convertToCSV = async (data) => {
  return new Promise((resolve, reject) => {
    json2csv(data, (error, csv) => {
      if (error) {
        return reject(error);
      }
      
      return resolve(csv);
    })
  });
}

const exportLinks = async (output) => {
  return new Promise(async (resolve, reject) => {
    let records = [];
    let csv = '';
    
    try {
      result = await getRecords();
      records = [
        ...records,
        ...result.Items,
      ];
      
      while(result.LastEvaluatedKey) {
        result = await getRecords(result.LastEvaluatedKey);
        records = [
          ...records,
          ...result.Items,
        ];
      }
    } catch (e) {
      log('Error getting records');
      return reject(e);
    }     
    
    try {
      csv = await convertToCSV(records);
    } catch (e) {
      log('Error writing csv');
      return reject(e);
    }
    
  
    fs.writeFile(output, csv, (error) => {
      if (error) {
        return reject(error);
      }
      
      return resolve();
    });
  });
};


module.exports = exportLinks;