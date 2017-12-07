#!/usr/bin/env node

const fs = require('fs');
const commander = require('commander');
const version = require('./utils/version');
const processes = require('./processes');

commander.version(version());
commander.usage('[command] [options]');
commander.option('-r, --reupload', 'Force reupload of items that exist in S3')

commander
  .command('upload [dir]')
  .description('Upload a directory')
  .action(processes.execute);

commander
  .command('config')
  .description('Configure bfu\'s AWS settings')
  .action(processes.config.configure);
  
commander.parse(process.argv);

// const dir = commander.args[0];
// processes.execute(dir)
//   .catch((error) => console.error(error));


