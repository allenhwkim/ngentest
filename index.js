#!/usr/bin/env node
const fs = require('fs');
const path = require('path'); // eslint-disable-line
const ts = require('typescript');
const glob = require('glob');

const Util = require('./src/util.js');
const FuncTestGen = require('./src/func-test-gen.js');

const ComponentTestGen = require('./src/component/component-test-gen.js');
const DirectiveTestGen = require('./src/directive/directive-test-gen.js');
const InjectableTestGen = require('./src/injectable/injectable-test-gen.js');
const PipeTestGen = require('./src/pipe/pipe-test-gen.js');
const ClassTestGen = require('./src/class/class-test-gen.js');

module.exports = function(tsFile, config) {
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

    const Klass = getKlass(typescript, config);

    Util.DEBUG &&
      console.warn('\x1b[36m%s\x1b[0m', `PROCESSING ${Klass.ctor && Klass.ctor.name} constructor`);
    const ctorMockData = getFuncMockData(Klass, 'constructor', 'constructor');

    const ctorParamJs = Util.getFuncParamJS(ctorMockData.params);
    ejsData.ctorParamJs = Util.indent(ctorParamJs, ' '.repeat(6)).trim();
    ejsData.providerMocks = testGenerator.getProviderMocks(ctorMockData.params);

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

    const generated = testGenerator.getGenerated(ejsData);
    if (generated) {
      testGenerator.writeGenerated(generated, config);
    }

    errors.forEach( e => console.error(e) );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function getKlass(typescript, config) {
  let replacedTypescript = 
    typescript.match(/class .*?{.*}$/ms)[0]
      .replace(/\s+extends\s\S+ {/gm, ' extends Object {') // rchange inheritance to an Object

  config.replacements.forEach( ({from,to}) => {
    replacedTypescript = replacedTypescript.replace(new RegExp(from, 'gm'), to);
  })

  const result = ts.transpileModule(replacedTypescript, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      experimentalDecorators: true,
      removeComments: true,
      target: ts.ScriptTarget.ES2015
    }
  });

  let klassText = result.outputText
    .replace(/super\(.*\);/gm, '') // remove inheritance code.
    .replace(/super\./gm, 'this.'); // change inheritance call to this call
  klassText =
    klassText.match(/(class .*?{.*});?\n.*?__decorate/ms)?.[1] || /* with decorators */
    klassText.match(/(class .*?{.*});?$/ms)?.[1] || /* generic */
    klassText;

  const Klass = new Function(`return ${klassText}`)();
  return Klass;
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