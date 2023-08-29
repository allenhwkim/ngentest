#!/usr/bin/env node
const execSync = require('child_process').execSync;
const path = require('path');
const assert = require('assert');
const fs = require('fs');

const srcFiles = [
  path.join(__dirname, 'test-examples', 'example.klass.ts'),
  path.join(__dirname, 'test-examples', 'example.component.ts'),
  path.join(__dirname, 'test-examples', 'example2.component.ts'),
  path.join(__dirname, 'test-examples', 'example3.component.ts'),
  path.join(__dirname, 'test-examples', 'example4.component.ts'),
  path.join(__dirname, 'test-examples', 'example5.component.ts'),
  path.join(__dirname, 'test-examples', 'example6.component.ts'),
  path.join(__dirname, 'test-examples', 'example7.component.ts'),
  path.join(__dirname, 'test-examples', 'example8.component.ts'),
  path.join(__dirname, 'test-examples', 'example9.component.ts'),
  path.join(__dirname, 'test-examples', 'exampleX.component.ts'),
  path.join(__dirname, 'test-examples', 'example.directive.ts'),
  path.join(__dirname, 'test-examples', 'example.service.ts'),
  path.join(__dirname, 'test-examples', 'example.pipe.ts'),
  path.join(__dirname, 'test-examples', 'example2.pipe.ts')
];

srcFiles.forEach(filePath => {
  const output = ('' + execSync(`./cli.js ${filePath} -F`))
    .replace(/\r\n/g, '\n');
  const expected = ('' + fs.readFileSync(filePath.replace('.ts', '.spec.ts')))
    .replace(/\r\n/g, '\n');
  if (output.trim() === expected.trim()) {
    console.info('passed check', filePath);
  } else {
    fs.writeFileSync(filePath + '.before.txt', expected);
    fs.writeFileSync(filePath + '.after.txt', output);
    throw new Error('Error with ' + filePath);
  }
});
