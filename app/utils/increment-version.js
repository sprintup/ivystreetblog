// app/utils/increment-version.js

const fs = require('fs');
const path = require('path');
console.log('Incrementing version...');

const versionFilePath = path.join(__dirname, 'version.js');
const versionFileContent = fs.readFileSync(versionFilePath, 'utf-8');

const currentVersion = versionFileContent.match(/version = "(\d+\.\d+\.\d+)"/)[1];
const [major, minor, patch] = currentVersion.split('.').map(Number);

const newPatch = patch + 1;
const newVersion = `${major}.${minor}.${newPatch}`;

const newFileContent = versionFileContent.replace(/version = "\d+\.\d+\.\d+"/, `version = "${newVersion}"`);

fs.writeFileSync(versionFilePath, newFileContent, 'utf-8');

console.log(`Version updated from ${currentVersion} to ${newVersion}`);