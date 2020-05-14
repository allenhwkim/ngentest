#!/usr/bin/env node
const fs = require('fs');
const path = require('path'); // eslint-disable-line
const yargs = require('yargs');
const ts = require('typescript');
const requireFromString = require('require-from-string');
const glob = require('glob');
const appRoot = require('app-root-path');

const config = require('./ngentest.config');
const Util = require('./src/util.js');
const FuncTestGen = require('./src/func-test-gen.js');

const ComponentTestGen = require('./src/component/component-test-gen.js');
const DirectiveTestGen = require('./src/directive/directive-test-gen.js');
const InjectableTestGen = require('./src/injectable/injectable-test-gen.js');
const PipeTestGen = require('./src/pipe/pipe-test-gen.js');
const ClassTestGen = require('./src/class/class-test-gen.js');

const argv = yargs.usage('Usage: $0 <tsFile> [options]')
  .options({
    's': { alias: 'spec', describe: 'write the spec file along with source file', type: 'boolean' },
    'f': {
      alias: 'force', 
      describe: 'It prints out a new test file, and it does not ask a question when overwrite spec file',
      type: 'boolean'
    },
    'F': {
      alias: 'forcePrint', 
      describe: 'It prints out to console, and it does not ask a question',
      type: 'boolean'
    },
    'm': { alias: 'method', describe: 'Show code only for this method', type: 'string' },
    'v': { alias: 'verbose', describe: 'log verbose debug messages', type: 'boolean' },
    'framework': { describe: 'test framework, jest or karma', type: 'string' },
    'c': { alias: 'config', describe: 'The configuration file to load options from', type: 'string', default: 'ngentest.config.js' }
  })
  .example('$0 my.component.ts', 'generate Angular unit test for my.component.ts')
  .help('h')
  .argv;

Util.DEBUG = argv.verbose;
const tsFile = argv._[0].replace(/\.spec\.ts$/, '.ts');
// const writeToSpec = argv.spec;
if (!(tsFile && fs.existsSync(tsFile))) {
  console.error('Error. invalid typescript file. e.g., Usage $0 <tsFile> [options]');
  process.exit(1);
}

if (argv.c && fs.existsSync(path.resolve(argv.c))) {
  loadConfig(path.resolve(argv.c));
} else {
  Util.DEBUG && console.log(`${argv.c} not found. Using default config instead.`)
}
Util.DEBUG && console.log('  *** config ***', config);

Util.FRAMEWORK = config.framework || argv.framework;

function loadConfig(filePath) {
  const userConfig = require(filePath);
  for (var key in userConfig) {
    config[key] = userConfig[key];
  }
}

function getFuncMockData (Klass, funcName, funcType) {
  const funcTestGen = new FuncTestGen(Klass, funcName, funcType);
  const funcMockData = {
    isAsync: funcTestGen.isAsync,
    props: {},
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

function getTestGenerator (tsPath, config) {
  const typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');
  const angularType = Util.getAngularType(typescript).toLowerCase();
  const testGenerator = /* eslint-disable */
    angularType === 'component' ? new ComponentTestGen(tsPath, config) :
    angularType === 'directive' ? new DirectiveTestGen(tsPath, config) :
    angularType === 'service' ? new InjectableTestGen(tsPath, config) :
    angularType === 'pipe' ? new PipeTestGen(tsPath, config) :
    new ClassTestGen(tsPath, config); /* eslint-enable */
  return testGenerator;
}

function getFuncTest(Klass, funcName, funcType, angularType) {
  Util.DEBUG &&
    console.log('\x1b[36m%s\x1b[0m', `\nPROCESSING #${funcName}`);

  const funcMockData = getFuncMockData(Klass, funcName, funcType);
  const [allFuncMockJS, asserts] = Util.getFuncMockJS(funcMockData, angularType);
  const funcMockJS = [...new Set(allFuncMockJS)];
  const funcParamJS = Util.getFuncParamJS(funcMockData.params);

  const funcAssertJS = asserts.map(el => `// expect(${el.join('.')}).toHaveBeenCalled()`);
  const jsToRun = 
    funcType === 'set' ? `${angularType}.${funcName} = ${funcParamJS || '{}'}`: 
    funcType === 'get' ? `const ${funcName} = ${angularType}.${funcName}` : 
    `${angularType}.${funcName}(${funcParamJS})`;
  const itBlockName = 
    funcType === 'method' ? `should run #${funcName}()` : 
    funcType === 'get' ? `should run GetterDeclaration #${funcName}` :
    funcType === 'set' ? `should run SetterDeclaration #${funcName}` : '';
  const asyncStr = funcMockData.isAsync ? 'await ' : '';

  return `
    it('${itBlockName}', async () => {
      ${funcMockJS.join(';\n')}${funcMockJS.length ? ';' : ''}
      ${asyncStr}${jsToRun};
      ${funcAssertJS.join(';\n')}${funcAssertJS.length ? ';' : ''}
    });
    `;
}

function run (tsFile) {
  try {
    const testGenerator = getTestGenerator(tsFile, config);
    const typescript = fs.readFileSync(path.resolve(tsFile), 'utf8');
    const angularType = Util.getAngularType(typescript).toLowerCase();
    const {ejsData} = testGenerator.getData();

    ejsData.config = config;
    // mockData is set after each statement is being analyzed from getFuncMockData
    ejsData.ctorParamJs; // declarition only, will be set from mockData
    ejsData.providerMocks; //  declarition only, will be set from mockData
    ejsData.accessorTests = {}; //  declarition only, will be set from mockData
    ejsData.functionTests = {}; //  declarition only, will be set from mockData

    const result = ts.transpileModule(typescript, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        experimentalDecorators: true,
        removeComments: true,
        target: ts.ScriptTarget.ES2015
      }
    });

    // replace invalid require statements
    let replacedOutputText = result.outputText
      .replace(/require\("\.(.*)"\)/gm, '{}') // replace require statement to a variable, {}
      .replace(/super\(.*\);/gm, '') // remove inheritance code
      .replace(/super\./gm, 'this.') // change inheritance call to this call
      .replace(/\s+extends\s\S+ {/gm, ' extends Object {') // rchange inheritance to an Object

    config.replacements.forEach( ({from,to}) => {
      replacedOutputText = replacedOutputText.replace(new RegExp(from, 'gm'), to);
    })

    const modjule = requireFromString(replacedOutputText);
    const Klass = modjule[ejsData.className];
    Util.DEBUG &&
      console.warn('\x1b[36m%s\x1b[0m', `PROCESSING ${Klass.ctor && Klass.ctor.name} constructor`);
    const ctorMockData = getFuncMockData(Klass, 'constructor', 'constructor');

    const ctorParamJs = Util.getFuncParamJS(ctorMockData.params);
    ejsData.ctorParamJs = Util.indent(ctorParamJs, ' '.repeat(6)).trim();
    ejsData.providerMocks = testGenerator.getProviderMocks(ctorMockData.params);
    // for (var key in ejsData.providerMocks) {
    //   ejsData.providerMocks[key] = Util.indent(ejsData.providerMocks[key]).replace(/\{\s+\}/gm, '{}');
    // }

    const errors = [];
    testGenerator.klassSetters.forEach(setter => {
      const setterName = setter.node.name.escapedText;
      ejsData.accessorTests[`${setterName} SetterDeclaration`] =
        Util.indent(getFuncTest(Klass, setterName, 'set', angularType), '  ');
    });
    testGenerator.klassGetters.forEach(getter => {
      const getterName = getter.node.name.escapedText;
      ejsData.accessorTests[`${getterName} GetterDeclaration`] =
        Util.indent(getFuncTest(Klass, getterName, 'get', angularType), '  ');
    });

    testGenerator.klassMethods.forEach(method => {
      const methodName = method.node.name.escapedText;
      try {
        ejsData.functionTests[methodName] =
          Util.indent(getFuncTest(Klass, methodName, 'method', angularType), '  ');
      } catch (e) {
        const msg = '    // '+ e.stack;
        const itBlock = `it('should run #${method.name}()', async () => {\n` +
          `${msg.replace(/\n/g, '\n    // ')}\n` +
          `  });\n`
        ejsData.functionTests[methodName] = itBlock;
        errors.push(e);
      }
    });

    // console.log('..................................................................')
    // console.log(ejsData)
    // console.log('..................................................................')
    const generated = testGenerator.getGenerated(ejsData, argv);
    generated && testGenerator.writeGenerated(generated, argv);

    errors.forEach( e => console.error(e) );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const isDir = fs.lstatSync(tsFile).isDirectory();
if (isDir) {
  const files = glob.sync('**/!(*.spec).ts', {cwd: tsFile})
  files.forEach(file => {
    const includeMatch = config.includeMatch.map(re => file.match(re)).some(e => !!e);
    const excludeMatch = config.excludeMatch.map(re => file.match(re)).some(e => !!e);
    if (excludeMatch) {
      console.log(' *** NOT processing (in excludeMatch)', path.join(tsFile, file));
    } else if (includeMatch) {
      console.log(' *** processing', path.join(tsFile, file));
      run(path.join(tsFile, file));
    } else {
      console.log(' *** NOT processing (not in includeMatch)', path.join(tsFile, file));
    }
  });
} else {
  run(tsFile);
}
