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
  const klassMethods = klass.methods;

  const result = ts.transpileModule(typescript, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, experimentalDecorators: true, target: ts.ScriptTarget.ES2015
    }
  });

  fs.writeFileSync('tmp.js', '' + result.outputText);
  // console.log('>>>>>>>>>>>>>>>>......', requireFromString(result.outputText));
  const modjule = require(path.resolve('tmp.js'));
  const Klass = modjule[ejsData.className];

  /**
   * process constructor
   */
  console.log(`PROCESSING ${klass.ctor.name} constructor`);
  const funcWriter = new NgFuncWriter(Klass, 'constructor');
  const ctorMockData = { // this will be update by funcWriter.setMockData()
    props: {}, // this variable values
    params: funcWriter.parameters, // param values e.g. {'paramCookie': {foo: [Function: obj]}}
    map: {} // e.g. { 'this.cookie': 'paramCookie'}
  };
  funcWriter.expressions.slice().forEach( expr => {
    funcWriter.setMockData(expr, ctorMockData);
  });

  const ctorProviders = Object.entries(ejsData.providers).reduce( (acc, [name, provider]) => {
    const type = provider.provide;
    const value = provider.useValue || ctorMockData.params[name];
    acc[name] = { type, value };
    return acc;
  }, {});
  const ctorParams = Object.values(ctorProviders).map(v => v.value);
  console.log('CHECKING IF CONSTRUCTOR WORKS', new Klass(...ctorParams), '\n\n');

  /**
   * methods
   */
  klass.methods.forEach(method => {
    console.log(`PROCESSING ${klass.ctor.name} ${method.name}`);
    const writer = new NgFuncWriter(Klass, method.name);
    console.log(`parameters`, writer.parameters);
    const props = Object.assign({}, ctorMockData.props);
    const funcMockData = { props, params: writer.parameters, map: {} };
    writer.expressions.slice().forEach( expr => {
      writer.setMockData(expr, funcMockData);
    });
    console.log('funcMockData', funMockData);
  });
}

run(tsFile);
