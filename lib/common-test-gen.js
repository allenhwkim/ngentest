const path = require('path');
const ejs = require('ejs');
const ts = require('typescript');
const TypescriptParser = require('./typescript-parser');

const Util = require('./util.js');

// convert Typescript-parsed nodes to an array
function __toArray(el) {
  return Array.isArray(el) ? el : 
  el && el.node ? [el] :
  [];
}

function __get(node) {
  node = node.node || node;

  const name = node.name && node.name.escapedText;
  let type;
  if (node.type && node.type.typeName) {
    type = node.type.typeName.escapedText;
  } else if (node.type && node.type.kind) {
    type = ts.SyntaxKind[node.type.kind].replace(/Keyword/,'').toLowerCase()
  } 

  let decorator;
  if (node.decorators) {
    const name = node.decorators[0].expression.expression.escapedText;
    const param = (node.decorators[0].expression.arguments[0] || {}).text;
    decorator = {name, param}
  }

  return {type, name, decorator};
}

function __getKlassDecorator(klass) {
  const klassDecorator = {};
  const props = klass.get('Decorator')
    .get('CallExpression')
    .get('ObjectLiteralExpression')
    .get('PropertyAssignment')

  __toArray(props).forEach(el => {
      const key = el.children[0].node.escapedText;
      const value = el.children[1].node;
      klassDecorator[key] = value;
    });

  return klassDecorator;
}


// all imports info. from typescript
// { Component: { moduleName: xxx, alias: xxx } }
function getImports() {
  const imports = [];

  const parsed = new TypescriptParser(this.typescript);
  __toArray(parsed.rootNode.get('ImportDeclaration'))
    .map(prop => {
    const moduleName = prop.node.moduleSpecifier.text;
    const namedImports = prop.get('ImportClause').get('NamedImports');
    const namespaceImport = prop.get('ImportClause').get('NamespaceImport');

    if (namespaceImport.node) {
      const alias = namespaceImport.node.name.escapedText;
      imports.push({name: '*', alias, moduleName});
    } else if (namedImports.node) {
      namedImports.node.elements.forEach(node => {
        const name = node.name.escapedText;
        imports.push({name, alias: undefined, moduleName});
      })
    }
  });

  return imports;
}

function getKlassProperties() {
  return __toArray(this.klass.get('PropertyDeclaration'))
    .concat(this.klass.get('SetAccessor'))
    .concat(this.klass.get('GetAccessor'))
  .map(prop => {
    return __get(prop);
  })
  .filter(el => el.name);
}

function getKlassSetters() { return __toArray(this.klass.get('SetAccessor')); }
function getKlassGetters() { return __toArray(this.klass.get('GetAccessor')); }
function getKlassMethods() { return __toArray(this.klass.get('MethodDeclaration')); }

function getKlass() {
  const parsed = new TypescriptParser(this.typescript);
  
  const klassDeclarations = __toArray(parsed.rootNode.get('ClassDeclaration'));
  const klass = klassDeclarations[0];

  if (!klass) {
    throw new Error(`Error:there is no class in typescript source`);
  }

  return klass;
}

function getAngularType() {
  return (__get(this.klass).decorator || {}).name;
}

// import statement mocks;
function getImportMocks() {
  const importMocks = [];
  const klassName = this.klass.node.name.escapedText;
  const moduleName = path.basename(this.tsPath).replace(/.ts$/, '');
 
  const imports = {};
  if (['component', 'directive'].includes(this.angularType)) {
    imports[`@angular/core`] = ['Component'];
  }
  imports[`./${moduleName}`] = [klassName]

  if (this.klass.get('Constructor').node) {
    const paremeters = this.klass.get('Constructor').node.parameters;
    paremeters.forEach(param => {
      const {name, type, decorator} = __get(param);
      const exportName = decorator ? decorator.name : type;
      const emport = this.imports.find(el => el.name === exportName); // name , alias

      const importStr = emport?.alias ? `${exportName} as ${emport.alias}` : exportName;
      if (exportName === 'Inject') { // do not import Inject, but import Inject name
        const commonTypes = ['APP_BASE_HREF', 'DOCUMENT', 'LOCATION_INITIALIZED', 'Time'];
        const importLib = commonTypes.includes(decorator.param) ? '@angular/common' : '@angular/core';
        imports[importLib] = (imports[importLib] || []).concat(decorator.param);
      } else {
        imports[emport.moduleName] = (imports[emport.moduleName] || []).concat(importStr);
      }
    });
  }

  for (var lib in imports) {
    const fileNames = imports[lib].join(', ');
    importMocks.push(`import { ${fileNames} } from '${lib}';`)
  }

  return importMocks;
}

function getProviderMocks(ctorMockData) {
  const providerMocks = {providers: [], mocks: []};
  if (!this.klass.get('Constructor').node) {
    return providerMocks;
  }

  const paremeters = this.klass.get('Constructor').node.parameters
  paremeters.forEach(param => {
    const {name, type, decorator} = __get(param);
    const injectClassName = decorator && decorator.name === 'Inject' && decorator.param;
    const injectUseStatement = 
      injectClassName === 'DOCUMENT' ? `useClass: MockDocument` :
      injectClassName === 'PLATFORM_ID' ? `useValue: 'browser'` :
      injectClassName === 'LOCALE_ID' ? `useValue: 'en'` : `useValue: ${injectClassName}`;

    const mockData = ctorMockData[name];
    mockData && (delete mockData['undefiend']);
    const mockDataJS = !mockData ? [] : 
      Object.entries(mockData).map(([k, v]) => `${k} = ${Util.objToJS(v)};`)

    const emport = this.imports.find(el => el.name === type); // name , alias, moduleName
    const emportFromFile = !!(emport && emport.moduleName.match(/^(\.|src\/)/));
    const configMockJS = this.config.providerMocks[type];
    let mockFn;
    if (type !== 'Object' && emportFromFile) {
      mockFn = (mockDataJS || []).concat(configMockJS);
    } else if (configMockJS) {
      mockFn = (mockDataJS || []).concat(configMockJS);
    }

    if (mockFn) {
      providerMocks.mocks.push(Util.indent(`
        @Injectable()
        class Mock${type} {
          ${mockFn.join('\n')}
        }`)
        .replace(/\n\s*?\n/gm, '\n') // remove empty lines
        .replace(/\{\s+?}\s*?/gm, '{}\n') // ...{\n} to ...{}
      );
    }

    // code for providers section at @Component({providers: XXXXXXXXX}
    if (type === 'ActivatedRoute') {
      providerMocks.providers.push(`{
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }`);
    } else if (this.config.providerMocks[type]) { // if mock is given from config
      providerMocks.providers.push(`{ provide: ${type}, useClass: Mock${type} }`);
    } else if (emportFromFile) {
      providerMocks.providers.push(`{ provide: ${type}, useClass: Mock${type} }`);
    } else if (injectClassName) {
      providerMocks.providers.push(`{ provide: '${injectClassName}', ${injectUseStatement} }`);
    } else {
      providerMocks.providers.push(type);
    }
  });

  return providerMocks;
}

function getInputMocks() {
  const inputMocks = {html: [], js: []};
  this.klassProperties.forEach(({type, name, decorator}) => {
    if (decorator && decorator.name === 'Input') {
      inputMocks.html.push(`[${decorator.param || name}]="${name}"`);
      inputMocks.js.push(`${name}: ${type};`);
    }
  });

  return inputMocks;
}

function getOutputMocks() {
  const outputMocks = {html: [], js: []};

  this.klassProperties.forEach(({type, name, decorator}) => {
    const funcName = `on${name.replace(/^[a-z]/, x => x.toUpperCase())}`;
    if (decorator && decorator.name === 'Output') {
      outputMocks.html.push(`(${decorator.param || name})="${funcName}($event)"`);
      outputMocks.js.push(`${funcName}(event): void { /* */ }`);
    }
  });

  return outputMocks;
}

function getComponentProviderMocks() {
  const mocks = [];

  const decorator = __getKlassDecorator(this.klass);
  if (decorator.providers) {
    const klassNames = decorator.providers.elements.map(el => el.escapedText);
    const providerMocks = klassNames.filter(name => name).map(name =>  {
      return `{ provide: ${name}, useClass: Mock${name} }`;
    });
    if (providerMocks.length) {
      mocks.push(`set: { providers: [${providerMocks.join(',\n')}] }`);
    }
  } 

  return mocks;
}

function getDirectiveSelector() {
  const decorator = __getKlassDecorator(this.klass);

  if (decorator.selector) {
    const selectorTxt = decorator.selector.text;
    if (selectorTxt.match(/^\[/)) {
      return { type: 'attribute', value: selectorTxt, name: selectorTxt.match(/[^\[\]]+/)[0] };
    } else if (selectorTxt.match(/^\./)) {
      return { type: 'class', value: selectorTxt, name: selectorTxt.match(/[^\.]+/)[0] };
    } else if (selectorTxt.match(/^[a-z]/i)) {
      return { type: 'element', value: selectorTxt, name: selectorTxt.match(/[a-z-]+/)[0] };
    }
  }
}

function getExistingTests(ejsData, existingTestCodes) {
  const existingTests = {};
  const allTests = Object.assign({}, ejsData.accessorTests || {}, ejsData.functionTests || {});
  for (var funcName in allTests) {
    // e.g. compoent.myFuncName(any, goes, here);
    const re = new RegExp(`\\S+\.${funcName}\\(?[\\s\\S]*\\)?;`, 'm');
    existingTests[funcName] = !!existingTestCodes.match(re);
  }

  return existingTests;
}

function getGenerated (ejsData) {
  const generated = ejs.render(this.template, ejsData).replace(/\n\s+$/gm, '\n');
  return generated;
}

const CommonGenFunctions = {
  getKlass,
  getImports,
  getKlassProperties,
  getKlassGetters,
  getKlassSetters,
  getKlassMethods,
  getAngularType,

  getInputMocks, // input coddes
  getOutputMocks, // output codes
  getImportMocks, // import statements code
  getProviderMocks, // module provider code
  getComponentProviderMocks,
  getDirectiveSelector,

  getGenerated
};

module.exports = CommonGenFunctions;
