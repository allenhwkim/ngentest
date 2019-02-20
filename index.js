#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const ejs = require('ejs');

const parseTypescript = require('./src/lib/parse-typescript.js');
const util = require('./src/lib/util.js');
const getDirectiveData = require('./src/get-directive-data.js');
const getInjectableData = require('./src/get-injectable-data.js');
const getPipeData = require('./src/get-pipe-data.js');
const getDefaultData = require('./src/get-default-data.js');

const argv = yargs.usage('Usage: $0 <angular-typescript-file> [options]')
  .options({
    's': { alias: 'spec', describe: 'write the spec file along with source file', type: 'boolean' }
  })
  .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
  .help('h')
  .argv;

const tsFile = '' + argv._;
const typescript = fs.readFileSync(path.resolve(tsFile), 'utf8');
const specFilePath = path.resolve(tsFile.replace(/\.ts$/, '.spec.ts'));

const existingItBlocks = {};
if (argv.spec && fs.existsSync(specFilePath)) {
  const tests = fs.readFileSync(specFilePath, 'utf8');
  (tests.match(/  it\('.*?',.*?\n  }\);/gs) || []).forEach(itBlock => {
    const key = itBlock.match(/it\('(.*?)',/)[1];
    existingItBlocks[key] = `\n${itBlock}\n`;
  });
}

parseTypescript(typescript).then(tsParsed => {
  const angularType = util.getAngularType(typescript); // Component, Directive, Injectable, Pipe, or undefined
  const ejsTemplate = util.getEjsTemplate(angularType);

  let ejsData;
  switch(angularType) {
    case 'Component':
    case 'Directive':
      ejsData = getDirectiveData(tsParsed, tsFile, angularType);
      break;
    case 'Injectable':
      ejsData = getInjectableData(tsParsed, tsFile);
      break;
    case 'Pipe':
      ejsData = getPipeData(tsParsed, tsFile);
      break;
    default:
      ejsData = getDefaultData(tsParsed, tsFile);
      break;
  }
  ejsData.functionTests = Object.assign({}, ejsData.functionTests, existingItBlocks);

  const generated = ejs.render(ejsTemplate, ejsData).replace(/\n\s+$/gm, '\n');
  if (argv.spec) {
    fs.existsSync(specFilePath) && util.createBackupFile(specFilePath);
    fs.writeFileSync(specFilePath, generated);
    console.log('Generated unit test for', argv._[0], 'to', specFilePath);
  } else {
    process.stdout.write(generated);
  }
});