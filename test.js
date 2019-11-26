#!/usr/bin/env node
const execSync = require('child_process').execSync;
const path = require('path');
const assert = require('assert');
const fs = require('fs');

const srcFiles = [
  `${path.join('src', 'for-class', 'example', 'example.klass.ts')}`,
  `${path.join('src', 'for-component', 'example', 'example.component.ts')}`,
  `${path.join('src', 'for-component', 'example', 'example2.component.ts')}`,
  `${path.join('src', 'for-component', 'example', 'example3.component.ts')}`,
  `${path.join('src', 'for-component', 'example', 'example4.component.ts')}`,
  `${path.join('src', 'for-component', 'example', 'example5.component.ts')}`,
  `${path.join('src', 'for-component', 'example', 'example6.component.ts')}`,
  `${path.join('src', 'for-directive', 'example', 'example.directive.ts')}`,
  `${path.join('src', 'for-injectable', 'example', 'example.service.ts')}`,
  `${path.join('src', 'for-pipe', 'example', 'example.pipe.ts')}`
];

srcFiles.forEach(filePath => {
  const output = ('' + execSync(`./index.js ${filePath} -F`))
    .replace(/\r\n/g, '\n');
  const expected = ('' + fs.readFileSync(filePath.replace('.ts', '.spec.ts')))
    .replace(/\r\n/g, '\n');
  if (output === expected) {
    console.log('passed check', filePath);
  } else {
    fs.writeFileSync(filePath + '.before.txt', expected);
    fs.writeFileSync(filePath + '.after.txt', output);
    throw new Error('Error on' + filePath);
  }
});
