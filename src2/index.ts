import * as fs from 'fs';
import * as yargs from 'yargs';

import { NgTestWriter } from './ng-test-writer';

const argv = yargs.usage('Usage: $0 <tsFile> [options]')
  .options({
    's': { alias: 'spec', describe: 'write the spec file along with source file', type: 'boolean' }
  })
  .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
  .help('h')
  .argv;

const tsFile = argv._[0];
const writeToSpec = argv.spec;
if (!(tsFile && fs.existsSync(tsFile))) {
  console.log('Error. invalid typescript file. e.g., Usage $0 <tsFile> [options]')
  process.exit(1);
}

const testWriter = new NgTestWriter(tsFile);
const testGenerator: any = testWriter.getTestGenerator();
testGenerator.getEjsData().then(ejsData => {
  console.log('ejsData..>>>>>>>>>>>>>>>>>>>>>>', ejsData);
  const generated = testGenerator.getGenerated(ejsData);
  testWriter.writeGenerated(generated, writeToSpec);
});

