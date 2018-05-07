#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');
var ejs = require('ejs');

var parseTypescript = require('./src/lib/parse-typescript.js');
var util = require('./src/lib/util.js');
var getDirectiveData = require('./src/get-directive-data.js');
var getInjectableData = require('./src/get-injectable-data.js');
var getPipeData = require('./src/get-pipe-data.js');
var getDefaultData = require('./src/get-default-data.js');

var argv = yargs.usage('Usage: $0 <angular-typescript-file> [options]')
  .options({
    // 'o': { alias: 'output', describe: 'output file', type: 'string' }
  })
  .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
  .help('h')
  .argv;

var tsFile = '' + argv._;
var typescript = fs.readFileSync(path.resolve(tsFile), 'utf8');

parseTypescript(typescript).then(tsParsed => {
  const angularType = util.getAngularType(tsParsed); // Component, Directive, Injectable, Pipe, or undefined
  const ejsTemplate = util.getEjsTemplate(angularType);
  let ejsData;
  switch(angularType) {
    case 'Component':
    case 'Directive':
      ejsData = getDirectiveData(tsParsed, tsFile);
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

  console.log('>>>>>>>>', ejsData);
  console.log(ejs.render(ejsTemplate, ejsData, {}))
  // console.log('xxxxxxxxxxxxxxx', tsParsed);
}).catch(e => {
  console.error(e);
});
