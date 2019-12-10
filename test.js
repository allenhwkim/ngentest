#!/usr/bin/env node
const execSync = require('child_process').execSync;
const path = require('path');
const assert = require('assert');
const fs = require('fs');

const srcFiles = [
  `${path.join('examples', 'example.klass.ts')}`,
  `${path.join('examples', 'example.component.ts')}`,
  `${path.join('examples', 'example2.component.ts')}`,
  `${path.join('examples', 'example3.component.ts')}`,
  `${path.join('examples', 'example4.component.ts')}`,
  `${path.join('examples', 'example5.component.ts')}`,
  `${path.join('examples', 'example6.component.ts')}`,
  `${path.join('examples', 'example7.component.ts')}`,
  `${path.join('examples', 'example8.component.ts')}`,
  `${path.join('examples', 'example9.component.ts')}`,
  `${path.join('examples', 'exampleX.component.ts')}`,
  `${path.join('examples', 'example.directive.ts')}`,
  `${path.join('examples', 'example.service.ts')}`,
  `${path.join('examples', 'example.pipe.ts')}`
  `${path.join('examples', 'example2.pipe.ts')}`
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
