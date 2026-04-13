const fs = require('fs');
const path = require('path');

const words = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'words.json'), 'utf-8')
);

const firstLetterMap = {};

for (const item of words) {
  const normalizedWord = String(item.word || '').trim();
  const firstLetter = normalizedWord.charAt(0).toUpperCase();

  if (!/^[A-Z]$/.test(firstLetter)) {
    continue;
  }

  if (!firstLetterMap[firstLetter]) {
    firstLetterMap[firstLetter] = [];
  }

  if (!firstLetterMap[firstLetter].includes(normalizedWord)) {
    firstLetterMap[firstLetter].push(normalizedWord);
  }
}

const orderedMap = {};
for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  orderedMap[letter] = (firstLetterMap[letter] || []).sort((leftWord, rightWord) =>
    leftWord.localeCompare(rightWord)
  );
}

fs.writeFileSync(
  path.join(__dirname, 'first-letter-map.js'),
  `module.exports = ${JSON.stringify(orderedMap, null, 2)};\n`
);

console.log('First letter map created');
