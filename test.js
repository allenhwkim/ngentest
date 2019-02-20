#!/usr/bin/env node
const execSync = require('child_process').execSync;
const path = require('path');
const assert = require('assert');
const fs = require('fs');

const srcFiles = [
  'my.component.ts',
  'my.pipe.ts',
  'my.service.ts',
  'my.directive.ts',
  'my.module.ts',
  'my.route.ts'
];

srcFiles.forEach(file => {
  const filePath = path.join(__dirname, 'src', 'examples', file);
  const output = '' + execSync(`./index.js ${filePath}`);
  const expected = '' + fs.readFileSync(filePath.replace('.ts', '.spec.ts'));
console.log(output);
console.log(expected);
  assert.equal(output.trim(), expected.trim());
});
