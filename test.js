#!/usr/bin/env node
const execSync = require('child_process').execSync;
const path = require('path');
const assert = require('assert');
const fs = require('fs');

const srcFiles = [
  `${path.join('src', 'for-class', 'example', 'example.klass.ts')}`,
  `${path.join('src', 'for-component', 'example', 'example.component.ts')}`,
  `${path.join('src', 'for-directive', 'example', 'example.directive.ts')}`,
  `${path.join('src', 'for-injectable', 'example', 'example.service.ts')}`,
  `${path.join('src', 'for-pipe', 'example', 'example.pipe.ts')}`
];

srcFiles.forEach(filePath => {
  const output = '' + execSync(`./index.js ${filePath}`);
  const expected = '' + fs.readFileSync(filePath.replace('.ts', '.spec.ts'));
  assert.strictEqual(output.trim(), expected.trim());
});
