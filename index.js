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
const TypescriptParser = require('./src/typescript-parser.js');

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
    'v': { alias: 'verbose', describe: 'log verbose debug messages', type: 'boolean' }
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

if (fs.existsSync(path.join(appRoot.path, 'ngentest.config.js'))) {
  const userConfig = require(path.join(appRoot.path, 'ngentest.config.js'));
  for (var key in userConfig) {
    config[key] = userConfig[key];
  }
}
Util.DEBUG && console.log('  *** config ***', config);

// getter/setter differntiate the same name function getter/setter
function getFuncMockData (Klass, funcName, props) {
  const funcTestGen = new FuncTestGen(Klass, funcName);
  const funcMockData = {
    isAsync: funcTestGen.isAsync,
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

function getFuncTest(Klass, func, angularType) {
  Util.DEBUG &&
    console.log('\x1b[36m%s\x1b[0m', `\nPROCESSING #${func.name}`);

  const type = func.constructor.name;
  // getter/setter differntiate the same name function getter/setter
  const funcMockData = getFuncMockData(Klass, func.name, {});
  const allFuncMockJS = Util.getFuncMockJS(funcMockData, angularType);
  const funcMockJS = [...new Set(allFuncMockJS)];
  const funcParamJS = Util.getFuncParamJS(funcMockData.params);

  const assertRE = /(.*?)\s*=\s*jest\.fn\(.*/;
  const funcAssertJS = funcMockJS
    .filter(el => el.match(assertRE))
    .map(el => {
      el = el.replace(/\n/g,' ');
      return el.replace(assertRE, (_, m1) => `expect(${m1}).toHaveBeenCalled()`);
    });
  const jsToRun = 
    type === 'SetterDeclaration' ? `${angularType}.${func.name} = ${funcParamJS || '{}'}`: 
    type === 'GetterDeclaration' ? `const ${func.name} = ${angularType}.${func.name}` : 
    `${angularType}.${func.name}(${funcParamJS})`;
  const itBlockName = type === 'MethodDeclaration' ? 
    `should run #${func.name}()` : `should run ${type} #${func.name}`;
  const asyncStr = funcMockData.isAsync ? 'await ' : '';

  return `
    it('${itBlockName}', async () => {
      ${funcMockJS.join(';\n')}${funcMockJS.length ? ';' : ''}
      ${asyncStr}${jsToRun};
      ${funcAssertJS.join(';\n')}${funcAssertJS.length ? ';' : ''}
    });
    `;
}

async function run (tsFile) {
  try {
    const testGenerator = getTestGenerator(tsFile, config);
    const { klass, typescript, ejsData } = await testGenerator.getData();
    const angularType = Util.getAngularType(typescript).toLowerCase();
    const tsParser = new TypescriptParser(typescript);

    ejsData.config = config;
    ejsData.ctorParamJs;
    ejsData.providerMocks;
    ejsData.klassProviders = tsParser.getDecoratorProviders();
    ejsData.accessorTests = {};
    ejsData.functionTests = {};

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
      console.warn('\x1b[36m%s\x1b[0m', `PROCESSING ${klass.ctor && klass.ctor.name} constructor`);
    const ctorMockData = getFuncMockData(Klass, 'constructor', {});

    const ctorParamJs = Util.getFuncParamJS(ctorMockData.params);
    ejsData.ctorParamJs = Util.indent(ctorParamJs, ' '.repeat(6)).trim();
    ejsData.providerMocks = testGenerator.getProviderMocks(klass, ctorMockData.params);
    for (var key in ejsData.providerMocks) {
      ejsData.providerMocks[key] = Util.indent(ejsData.providerMocks[key]).replace(/\{\s+\}/gm, '{}');
    }

    const errors = [];
    klass.accessors.forEach(accessor => {
      const type = accessor.constructor.name === 'SetterDeclaration' ? '=' : '';
      // getter/setter differntiate the same name function getter/setter
      ejsData.accessorTests[accessor.name + type] =
        Util.indent(getFuncTest(Klass, accessor, angularType), '  ');
    });


    klass.methods.forEach(method => {
      try {
        ejsData.functionTests[method.name] =
          Util.indent(getFuncTest(Klass, method, angularType), '  ');
      } catch (e) {
        const msg = '    // '+ e.stack;
        const itBlock = `it('should run #${method.name}()', async () => {\n` +
          `${msg.replace(/\n/g, '\n    // ')}\n` +
          `  });\n`
        ejsData.functionTests[method.name] = itBlock;
        errors.push(e);
      }
    });

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
