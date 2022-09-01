const fs = require('fs');
if (fs.existsSync('lib')) {
  fs.rmdirSync('lib', {recursive: true});
}
