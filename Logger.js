const fs = require('fs');

function print(value) {

  fs.appendFile('Logg.txt', value + '\n', (err) => {
    if (err) {
      console.error('Error appending to logger.txt:', err);
    } else {
      console.log('Value appended to logger.txt:', "");
    }
  });
}

module.exports = { print }