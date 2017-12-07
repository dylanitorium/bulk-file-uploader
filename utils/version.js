const path = require('path');
const fs = require('fs'); 

module.exports = () => (
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json'))).version
);
