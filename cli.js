#!/usr/bin/env node
const fs = require('fs');
const path = require('path'); 
const yargs = require('yargs');

const Util = require('./lib/util.js');
const ngentest = require('./lib/index.js');

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

const tsPath = argv._[0];
if (!tsPath || !(tsPath && fs.existsSync(tsPath))) {
  console.error('Error. invalid typescript file. e.g., Usage $0 <tsFile> [options]');
  process.exit(1);
}

/* user config from config files */
const options = argv.config ? require(path.resolve(argv.config)) : {};

/* global DEBUG / FRAMEWORK setting*/
Util.DEBUG = argv.verbose;
Util.FRAMEWORK = argv.framework || options.framework;

/* read tsFile and generate unit test */
const typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');
const generated = ngentest(typescript, {...options, tsPath});

/* write unit test file out */
if (argv.spec) { /* write to .spec.ts */
  const specPath = path.resolve(tsPath.replace(/\.ts$/, '.spec.ts'));
  const specFileExists = fs.existsSync(specPath);
  if (specFileExists) {
    if (argv.force) {
      fs.writeFileSync(specPath, generated);
      console.info('Generated unit test to', specPath);
    } else {
      console.error('\x1b[33m%s\x1b[0m', `ERROR!, ${specPath} already exists.`);
      process.stdout.write(generated);
    }
  } else {
    fs.writeFileSync(specPath, generated);
    console.info('Generated unit test to', specPath);
  }
} else { /* write to console */
  process.stdout.write(generated);
}
