const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const ts = require('typescript');

const NgClassWriter = require('./ng-class-writer.js');

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

run(tsFile);

async function run (tsFile) {
  const testWriter = new NgClassWriter(tsFile);
  const { klass, typescript, ejsData } = await testWriter.getData(); // { klass, imports, parser, typescript, ejsData }

  const thisScope = {};

  for (var varName in ejsData.providers) {
    const provider = ejsData.providers[varName];
    const aFunction = function () {};
    const type = provider.provide;
    const value = provider.useValue || aFunction;
    thisScope[varName] = { type, value, constructor: true };
  }

  const result = ts.transpileModule(typescript, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, experimentalDecorators: true, target: ts.ScriptTarget.ES2015
    }
  });

  fs.writeFileSync('tmp.js', '' + result.outputText);
  // console.log('>>>>>>>>>>>>>>>>......', requireFromString(result.outputText));
  const module = require(path.resolve('tmp.js'));
  const Klass = module[ejsData.className];

  const tsParsed = testWriter.getTSParsed(klass, 'constructor');
  const jsParsed = testWriter.getJSParsed(Klass, 'constructor');

  console.log('>>>>', {tsParsed, jsParsed});

  const jsFuncBlock = jsParsed.value.body;
  const jsFuncStatements = jsFuncBlock.body;

  console.log('>>>> >>>>> jsFiuncStatements', jsFuncStatements); // ExpressionStatement -> expression ->  left, right
  console.log('>>>> >>>>> statements', jsFuncStatements.map(node => testWriter.getJSCode(Klass, node)));
  console.log('>>>> >>>>> >>>>>>', jsFuncStatements.map(node => testWriter.getJSCode(Klass, node.expression.right))); // ExpressionStatement -> expression ->  left, right

  // instanceProps  = {}
  // funcParms = {} ... constructor params


  const ctorParams = Object.values(thisScope).map(el => el.value);
  // console.log('module....... new Klass(...)', new Klass(... ctorParams));

  // const parsedConstructor = testGenerator.getParsedFunc('constructor');
  // console.log('...... >>>>>', parsedConstructor);

}
