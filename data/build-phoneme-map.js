const fs = require('fs');
const path = require('path');
const data = require('./output.js');

function normalizeArpabetSymbol(symbol) {
  return String(symbol || '').replace(/[0-9]/g, '');
}

const arpabetMap = {};
const ipaMap = {};

for (const item of data) {
  const word = item.word;

  if (Array.isArray(item.arpabet)) {
    for (const phoneme of item.arpabet) {
      const normalizedPhoneme = normalizeArpabetSymbol(phoneme);

      if (!normalizedPhoneme || normalizedPhoneme === '?') {
        continue;
      }

      if (!arpabetMap[normalizedPhoneme]) {
        arpabetMap[normalizedPhoneme] = [];
      }

      if (!arpabetMap[normalizedPhoneme].includes(word)) {
        arpabetMap[normalizedPhoneme].push(word);
      }
    }
  }

  if (Array.isArray(item.ipa)) {
    for (const phoneme of item.ipa) {
      if (!phoneme || phoneme === '?') {
        continue;
      }

      if (!ipaMap[phoneme]) {
        ipaMap[phoneme] = [];
      }

      if (!ipaMap[phoneme].includes(word)) {
        ipaMap[phoneme].push(word);
      }
    }
  }
}

for (const key of Object.keys(arpabetMap)) {
  arpabetMap[key].sort((leftWord, rightWord) => leftWord.localeCompare(rightWord));
}

for (const key of Object.keys(ipaMap)) {
  ipaMap[key].sort((leftWord, rightWord) => leftWord.localeCompare(rightWord));
}

fs.writeFileSync(
  path.join(__dirname, 'phoneme-map.js'),
  `module.exports = ${JSON.stringify(
    {
      arpabet: arpabetMap,
      ipa: ipaMap,
    },
    null,
    2
  )};\n`
);

console.log('Phoneme map created');
