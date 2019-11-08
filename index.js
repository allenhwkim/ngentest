#!/usr/bin/env node

const fs = require('fs');
const path = require('path'); // eslint-disable-line
const yargs = require('yargs');
const ts = require('typescript');
const requireFromString = require('require-from-string');

const NgClassWriter = require('./src/ng-class-writer.js');
const NgFuncWriter = require('./src/ng-func-writer.js');
const Util = require('./src/util.js');

const argv = yargs.usage('Usage: $0 <tsFile> [options]')
  .options({
    's': { alias: 'spec', describe: 'write the spec file along with source file', type: 'boolean' },
    'v': { alias: 'verbose', describe: 'log verbose debug messages', type: 'boolean' }
  })
  .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
  .help('h')
  .argv;

Util.DEBUG = argv.verbose;
const tsFile = argv._[0];
// const writeToSpec = argv.spec;
if (!(tsFile && fs.existsSync(tsFile))) {
  console.log('Error. invalid typescript file. e.g., Usage $0 <tsFile> [options]');
  process.exit(1);
}

function getFuncMockData (Klass, funcName, props) {
  const funcWriter = new NgFuncWriter(Klass, funcName);
  const funcMockData = { props, params: funcWriter.parameters, map: {}, globals: {} };
  funcWriter.expressions.forEach((expr, ndx) => {
    const code = funcWriter.classCode.substring(expr.start, expr.end);
    console.log('  *** EXPRESSION ***', ndx, code.replace(/\n+/g, '').replace(/\s+/g, ' '));
    funcWriter.setMockData(expr, funcMockData);
  });

  return funcMockData;
}

async function run (tsFile) {
  const testWriter = new NgClassWriter(tsFile);
  const { klass, typescript, ejsData } = await testWriter.getData(); // { klass, imports, parser, typescript, ejsData }

  const result = ts.transpileModule(typescript, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, experimentalDecorators: true, target: ts.ScriptTarget.ES2015
    }
  });

  const modjule = requireFromString(result.outputText);
  const Klass = modjule[ejsData.className];
  console.warn('\x1b[36m%s\x1b[0m', `PROCESSING ${klass.ctor.name} constructor`);
  const ctorMockData = getFuncMockData(Klass, 'constructor', {});
  console.log(`  === RESULT 'ctorMockData' ===`, ctorMockData);
  console.log('...................... ejsData.providers   ..........\n', ejsData.providers);
  // console.log('...................... ejsData.windowMocks ..........\n', ejsData.windowMocks);
  console.log('...................... ctorMockData        ..........\n', ctorMockData);
  // const ctorParams = Object.entries(ctorMockData.params).map(([key, val]) => ejsData.providers[key].useValue || val);
  // console.log('CHECKI#NG IF CONSTRUCTOR WORKS', new Klass(...ctorParams), 'SUCCESS!!\n');
  ejsData.providerMocks = testWriter.getProviderMocks(klass, ctorMockData.params);
  for (var key in ejsData.providerMocks) {
    ejsData.providerMocks[key] = Util.indent(ejsData.providerMocks[key]).replace(/\{\s+\}/gm, '{}');
    // console.log(key,':', ejsData.providerMocks[key]);
  }
  klass.methods.forEach(method => {
    console.log('\x1b[36m%s\x1b[0m', `\nPROCESSING ${klass.ctor.name}#${method.name}`);
    const thisValues = Object.assign({}, ctorMockData.props);
    const funcMockData = getFuncMockData(Klass, method.name, thisValues);
    const funcMockJS = Util.getFuncMockJS(funcMockData);
    const funcParamJS = Util.getFuncParamJS(funcMockData);
    ejsData.functionTests[method.name] = Util.indent(`
      it('should run #${method.name}()', async () => {
        ${funcMockJS}
        component.${method.name}(${funcParamJS});
      });
    `, '  ');
  });

  const generated = testWriter.getGenerated(ejsData);
  testWriter.writeGenerated(generated, argv.spec);

}

run(tsFile);
