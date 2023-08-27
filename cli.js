#!/usr/bin/env node
const fs = require('fs');
const path = require('path'); // eslint-disable-line
const yargs = require('yargs');

const config = require('./ngentest.config');
const Util = require('./src/util.js');
const ngentest = require('./index.js');
const ts = require('typescript');

const argv = yargs.usage('Usage: $0 <tsFile> [options]')
  .options({
    's': { alias: 'spec', describe: 'write the spec file along with source file', type: 'boolean' },
    'f': {
      alias: 'force', 
      describe: 'It prints out a new test file, and it does not ask a question when overwrite spec file',
      type: 'boolean'
    },
    'v': { alias: 'verbose', describe: 'log verbose debug messages', type: 'boolean' },
    'framework': { describe: 'test framework, jest or karma', type: 'string' },
    'c': { alias: 'config', describe: 'The configuration file to load options from', type: 'string', default: 'ngentest.config.js' }
  })
  .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
  .help('h')
  .argv;

if (argv.config) {
  if (fs.existsSync(path.resolve(argv.config))) {
    const userConfig = require(path.resolve(argv.config));
    for (var key in userConfig) {
      config[key] = userConfig[key];
    }
  } else {
    console.error(`ERROR: ${argv.config} not found`);
    exit(1);
  }
}

Util.DEBUG = argv.verbose;
Util.DEBUG && console.log('  *** config ***', config);
Util.FRAMEWORK = config.framework || argv.framework;

const tsFile = argv._[0]?.replace(/\.spec\.ts$/, '.ts');
if (!(tsFile && fs.existsSync(tsFile))) {
  console.error('Error. invalid typescript file. e.g., Usage $0 <tsFile> [options]');
  process.exit(1);
}

const options = Object.assign({}, config, {
  spec: argv.spec,
  force: argv.force,
  verbose: config.verbose || argv.verbose,
});
ngentest(tsFile, options);