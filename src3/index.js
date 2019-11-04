const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const ts = require('typescript');

const NgClassWriter = require('./ng-class-writer.js');
const NgFuncWriter = require('./ng-func-writer.js');

const argv = yargs.usage('Usage: $0 <tsFile> [options]')
  .options({
    's': { alias: 'spec', describe: 'write the spec file along with source file', type: 'boolean' }
  })
  .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
  .help('h')
  .argv;

const tsFile = argv._[0];
// const writeToSpec = argv.spec;
if (!(tsFile && fs.existsSync(tsFile))) {
  console.log('Error. invalid typescript file. e.g., Usage $0 <tsFile> [options]');
  process.exit(1);
}

async function run (tsFile) {
  const testWriter = new NgClassWriter(tsFile);
  const { klass, typescript, ejsData } = await testWriter.getData(); // { klass, imports, parser, typescript, ejsData }

  const result = ts.transpileModule(typescript, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, experimentalDecorators: true, target: ts.ScriptTarget.ES2015
    }
  });

  fs.writeFileSync('tmp.js', '' + result.outputText);
  // console.log('>>>>>>>>>>>>>>>>......', requireFromString(result.outputText));
  const modjule = require(path.resolve('tmp.js'));
  const Klass = modjule[ejsData.className];
  const ctorMockData = { // this will be update by funcWriter.setMockData()
    props: {}, // this variable values
    params: {}, // param values e.g. {'paramCookie': {foo: [Function: obj]}}
    map: {} // e.g. { 'this.cookie': 'paramCookie'}
  };

  /**
   * process constructor
   */
  console.warn('\x1b[36m%s\x1b[0m', `PROCESSING ${klass.ctor.name} constructor`);

  const funcWriter = new NgFuncWriter(Klass, 'constructor');
  ctorMockData.params = funcWriter.parameters;
  funcWriter.expressions.slice().forEach(expr => {
    funcWriter.setMockData(expr, ctorMockData);
  });
  console.log(`  === RESULT 'this' ===`, ctorMockData.props);
  console.log(`  === RESULT params ===`, ctorMockData.params);
  console.log(`  === RESULT map    ===`, ctorMockData.map);

  const ctorParams = Object.entries(ctorMockData.params)
    .map(([key, val]) => ejsData.providers[key].useValue || val);
  console.log('CHECKING IF CONSTRUCTOR WORKS', new Klass(...ctorParams), 'SUCCESS!!\n');

  /**
   * methods
   */
  klass.methods.slice().forEach(method => {
    console.log('\x1b[36m%s\x1b[0m', `\nPROCESSING ${klass.ctor.name}#${method.name}`);
    const writer = new NgFuncWriter(Klass, method.name);
    const props = Object.assign({}, ctorMockData.props);
    const funcMockData = { props, params: writer.parameters, map: {} };
    writer.expressions.forEach((expr, ndx) => {
      const code = writer.classCode.substring(expr.start, expr.end);
      console.log('  *** EXPRESSION ***', ndx, code);
      writer.setMockData(expr, funcMockData);
    });
    console.log(`  === RESULT 'this' ===`, funcMockData.props);
    console.log(`  === RESULT params ===`, funcMockData.params);
    console.log(`  === RESULT map    ===`, funcMockData.map);
  });
}

run(tsFile);
