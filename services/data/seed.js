import fs from 'fs';
import booklistData from './booklistDataMock.js';

// Write the entire booklistData array to a single JSON file
fs.writeFile('booklistData.json', JSON.stringify(booklistData, null, 4), (err) => {
  if (err) {
    console.error(`Error writing file on disk: ${err}`);
  } else {
    console.log('Data successfully written to booklistData.json');
  }
});
