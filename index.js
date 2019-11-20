#!/usr/bin/env node
const fs = require('fs');
const path = require('path'); // eslint-disable-line
const yargs = require('yargs');
const ts = require('typescript');
const requireFromString = require('require-from-string');

const Util = require('./src/util.js');
const FuncTestGen = require('./src/func-test-gen.js');

const ComponentTestGen = require('./src/for-component/component-test-gen.js');
const DirectiveTestGen = require('./src/for-directive/directive-test-gen.js');
const InjectableTestGen = require('./src/for-injectable/injectable-test-gen.js');
const PipeTestGen = require('./src/for-pipe/pipe-test-gen.js');
const ClassTestGen = require('./src/for-class/class-test-gen.js');

const argv = yargs.usage('Usage: $0 <tsFile> [options]')
  .options({
    's': { alias: 'spec', describe: 'write the spec file along with source file', type: 'boolean' },
    'f': { alias: 'force', describe: 'Do not ask question when overwrite spec file', type: 'boolean' },
    'v': { alias: 'verbose', describe: 'log verbose debug messages', type: 'boolean' }
  })
  .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
  .help('h')
  .argv;

Util.DEBUG = argv.verbose;
const tsFile = argv._[0];
// const writeToSpec = argv.spec;
if (!(tsFile && fs.existsSync(tsFile))) {
  console.error('Error. invalid typescript file. e.g., Usage $0 <tsFile> [options]');
  process.exit(1);
}

function getFuncMockData (Klass, funcName, props) {
  const funcTestGen = new FuncTestGen(Klass, funcName);
  const funcMockData = {
    props,
    params: funcTestGen.getInitialParameters(),
    map: {},
    globals: {}
  };
  funcTestGen.getExpressionStatements().forEach((expr, ndx) => {
    const code = funcTestGen.classCode.substring(expr.start, expr.end);
    Util.DEBUG && console.log('  *** EXPRESSION ***', ndx, code.replace(/\n+/g, '').replace(/\s+/g, ' '));
    funcTestGen.setMockData(expr, funcMockData);
  });

  return funcMockData;
}

function getTestGenerator (tsPath) {
  const typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');
  const angularType = Util.getAngularType(typescript).toLowerCase();
  const testGenerator = /* eslint-disable */
    angularType === 'component' ? new ComponentTestGen(tsPath) :
    angularType === 'directive' ? new DirectiveTestGen(tsPath) :
    angularType === 'service' ? new InjectableTestGen(tsPath) :
    angularType === 'pipe' ? new PipeTestGen(tsPath) :
    new ClassTestGen(tsPath); /* eslint-enable */
  return testGenerator;
}

async function run (tsFile) {
  try {
    const testGenerator = getTestGenerator(tsFile);
    const { klass, typescript, ejsData } = await testGenerator.getData();

    const result = ts.transpileModule(typescript, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS, experimentalDecorators: true, target: ts.ScriptTarget.ES2015
      }
    });

    // replace invalid require statements
    const replacedOutputText = result.outputText.replace(/require\("\.[^\)]+\)/gm, '{}');
    const modjule = requireFromString(replacedOutputText);
    const Klass = modjule[ejsData.className];
    Util.DEBUG &&
      console.warn('\x1b[36m%s\x1b[0m', `PROCESSING ${klass.ctor && klass.ctor.name} constructor`);
    const ctorMockData = getFuncMockData(Klass, 'constructor', {});
    const ctorParamJs = Util.getFuncParamJS(ctorMockData);
    ejsData.ctorParamJs = ctorParamJs;
    ejsData.providerMocks = testGenerator.getProviderMocks(klass, ctorMockData.params);
    for (var key in ejsData.providerMocks) {
      ejsData.providerMocks[key] = Util.indent(ejsData.providerMocks[key]).replace(/\{\s+\}/gm, '{}');
    }
    ejsData.functionTests = {};

    Util.DEBUG && console.log(`  === RESULT 'ctorMockData' ===`, ctorMockData);
    Util.DEBUG && console.log('...................... ejsData   ..........\n', ejsData);
    Util.DEBUG && console.log('...................... ctorMockData        ..........\n', ctorMockData);
    // const ctorParams = Object.entries(ctorMockData.params).map( ([key, val]) => ejsData.providers[key].useValue || val );
    // console.log('CHECKI#NG IF CONSTRUCTOR WORKS', new Klass(...ctorParams), 'SUCCESS!!\n');

    const angularType = Util.getAngularType(typescript).toLowerCase();
    // TODO:
    // . move method code into class-writer to get functionTests
    // . create a function to get one functionTest code
    //    . getFunctionTest(funcName)
    // . create a function to write one functionTest code in case you overwrite a file
    //    . writeFunctionTest(funcName)
    // . separte class-level test and function-level test so that
    //   . it does not write class-level test when file exists
    //      . writeClassTest()
    // klass.accessors(properties, methods, ctor)
    ejsData.accessorTests = {};
    const methodName = undefined;
    // const methodName = 'handleDaysAffected';
    const klassAccessors = klass.accessors.filter(el => !methodName || (el.name === methodName));
    klassAccessors.forEach(accessor => {
      Util.DEBUG &&
        console.log('\x1b[36m%s\x1b[0m', `\nPROCESSING ${klass.ctor && klass.ctor.name}#${accessor.name}`);

      const type = accessor.constructor.name;
      const funcMockData = getFuncMockData(Klass, accessor.name, {});
      const funcMockJS = Util.getFuncMockJS(funcMockData, angularType);
      const assertRE = /(.*?)\s*=\s*jest\.fn\(.*\)/;
      const funcAssertJS = funcMockJS
        .filter(el => el.match(assertRE))
        .map(el => el.replace(assertRE, (_, m1) => `expect(${m1}).toHaveBeenCalled()`));
      const funcParamJS = Util.getFuncParamJS(funcMockData);
      const jsToRun = 
        type === 'SetterDeclaration' ? `${angularType}.${accessor.name} = ${funcParamJS}`: 
        type === 'GetterDeclaration' ? `const ${accessor.name} = ${angularType}.${accessor.name}` : '';
      ejsData.accessorTests[accessor.name] = Util.indent(`
        it('should run ${type} #${accessor.name}', async () => {
          ${funcMockJS.join(';\n')}${funcMockJS.length ? ';' : ''}
          ${jsToRun};
          ${funcAssertJS.join(';\n')}${funcAssertJS.length ? ';' : ''}
        });
      `, '  ');
    });

    const klassMethods = klass.methods.filter(el => !methodName || (el.name === methodName));
    klassMethods.forEach(method => {
      Util.DEBUG &&
        console.log('\x1b[36m%s\x1b[0m', `\nPROCESSING ${klass.ctor && klass.ctor.name}#${method.name}`);
      // const thisValues = Object.assign({}, ctorMockData.props);
      const funcMockData = getFuncMockData(Klass, method.name, {});
      const funcMockJS = Util.getFuncMockJS(funcMockData, angularType);
      const funcParamJS = Util.getFuncParamJS(funcMockData);
      const assertRE = /(.*?)\s*=\s*jest\.fn\(.*/;
      const funcAssertJS = funcMockJS
        .filter(el => el.match(assertRE))
        .map(el => {
          el = el.replace(/\n/g,' ');
          return el.replace(assertRE, (_, m1) => `expect(${m1}).toHaveBeenCalled()`);
        });
      ejsData.functionTests[method.name] = Util.indent(`
        it('should run #${method.name}()', async () => {
          ${funcMockJS.join(';\n')}${funcMockJS.length ? ';' : ''}
          ${angularType}.${method.name}(${funcParamJS});
          ${funcAssertJS.join(';\n')}${funcAssertJS.length ? ';' : ''}
        });
      `, '  ');
    });

    const generated = testGenerator.getGenerated(ejsData);
    testGenerator.writeGenerated(generated, argv.spec, argv.force);
  } catch (e) {
    console.error(tsFile);
    console.error(e);
    process.exit(1);
  }
}

run(tsFile);
