const path = require('path');

const Util = require('./util.js');

function getInputs (klass) {
  const inputs = { attributes: [], properties: [] };
  (klass.properties || []).forEach(prop => {
    const key = prop.name;
    const body = this.typescript.substring(prop.start, prop.end);
    if (body.match(/@Input\(/)) {
      const attrName =
        prop.body ? (prop.body.match(/@Input\(['"](.*?)['"]\)/) || [])[1] : prop.name;
      inputs.attributes.push(`[${attrName || key}]="${key}"`);
      inputs.properties.push(`${key}: ${prop.type};`);
    }
  });

  return inputs;
}

function getOutputs (klass) {
  const outputs = { attributes: [], properties: [] };
  (klass.properties || []).forEach(prop => {
    const key = prop.name;
    const body = this.typescript.substring(prop.start, prop.end);
    if (body.match(/@Output\(/)) {
      const attrName =
        prop.body ? (prop.body.match(/@Input\(['"](.*?)['"]\)/) || [])[1] : prop.name;
      const funcName = `on${key.replace(/^[a-z]/, x => x.toUpperCase())}`;
      outputs.attributes.push(`(${attrName || key})="${funcName}($event)"`);
      outputs.properties.push(`${funcName}(event): void { /* */ }`);
    }
  });

  return outputs;
}

// Iterate methods, getnerate test with the function with parameter;
function getItBlocks (klass) {
  const blocks = {};
  (klass.methods || []).forEach(method => {
    const testName = `should run #${method.name}()`;
    // const parameters = (method.parameters || []).map(param => param.name).join(', ');

    blocks[method.name] = Util.indent(`
      it('${testName}', async () => {
      });`, '  ');
  });

  return blocks;
}

function getImports (klass) {
  const imports = {};
  const constructorParams = (klass.ctor && klass.ctor.parameters) || [];

  imports['@angular/core'] = ['Component'];
  imports[`./${path.basename(this.tsPath)}`.replace(/.ts$/, '')] = [klass.name];

  constructorParams.forEach( (param, index) => {
    const paramBody = this.typescript.substring(param.start, param.end);

    const injectMatches = paramBody.match(/@Inject\(([A-Z0-9_]+)\)/) || [];
    const injectClassName = injectMatches[1];
    if (injectClassName) { // e.g. @Inject(LOCALE_ID) language
      const iimport = this.imports[injectClassName];
      imports[iimport.mport.libraryName] = imports[iimport.mport.libraryName] || [];
      imports[iimport.mport.libraryName].push(injectClassName);
      // imports[iimport.mport.libraryName].push(param.type);
    } else {
      const className = (param.type || '').replace(/<[^>]+>/, '');
      const iimport = this.imports[className];

      if (iimport) {
        const importStr = iimport.mport.alias ?
          `${iimport.specifier.specifier} as ${iimport.mport.alias}` : iimport.specifier.specifier;
        imports[iimport.mport.libraryName] = imports[iimport.mport.libraryName] || [];
        imports[iimport.mport.libraryName].push(importStr);
      }
    }
  });

  return imports;
}

/* @returns @Component providers: code */
function getProviders (klass) {
  const constructorParams = (klass.ctor && klass.ctor.parameters) || [];
  const providers = {};

  constructorParams.forEach( (param, index) => { // name, type, start, end
    const paramBody = this.typescript.substring(param.start, param.end);
    const injectMatches = paramBody.match(/@Inject\(([A-Z0-9_]+)\)/) || [];
    const injectClassName = injectMatches[1];
    const className = (param.type || '').replace(/<[^>]+>/, '');
    const iimport = this.imports[className];

    if (injectClassName === 'DOCUMENT') {
      providers[param.name] = `{ provide: DOCUMENT, useClass: MockDocument }`;
    } else if (injectClassName === 'PLATFORM_ID') {
      providers[param.name] = `{ provide: 'PLATFORM_ID', useValue: 'browser' }`;
    } else if (injectClassName === 'LOCALE_ID') {
      providers[param.name] = `{ provide: 'LOCALE_ID', useValue: 'en' }`;
    } else if (param.type.match(/^(ElementRef|Router|HttpClient|TranslateService)$/)) {
      providers[param.name] = `{ provide: ${param.type}, useClass: Mock${param.type} }`;
    } else if (iimport && iimport.mport.libraryName.match(/^\./)) { // user-defined classes
      providers[param.name] = `{ provide: ${param.type}, useClass: Mock${param.type} }`;
    } else {
      providers[param.name] = param.type;
    }
  });

  return providers;
}

/* @returns mock data for this test */
/* ctorParams : { key: <value in JS object> */
function getProviderMocks (klass, ctorParams) {
  const mocks = {};
  const providers = this._getProviders(klass);
  /* { var: { provide: 'Class', useClass: 'MockClass'}, ...} */

  function getCtorVarsJS (varName) {
    const vars = ctorParams[varName];
    return Object.entries(vars).map( ([key, value]) => {
      // console.log(`>>>>>>>>>>>>>>>> value`, value);
      return `${key} = ${Util.objToJS(value)};`;
    });
  }

  const constructorParams = (klass.ctor && klass.ctor.parameters) || [];
  constructorParams.forEach(param => {
    const iimport = this.imports[param.type];
    const ctorVars = getCtorVarsJS(param.name);
    const typeVars = /* eslint-disable */
      param.type === 'ElementRef' ? ['nativeElement = {};'] :
      param.type === 'Router' ? ['navigate = jest.fn();'] :
      param.type === 'Document' ? ['querySelector = jest.fn();'] :
      param.type === 'HttpClient' ? ['post = jest.fn();'] :
      param.type === 'TranslateService' ? ['translate = jest.fn();'] :
      iimport && iimport.mport.libraryName.match(/^[\.]+/) ? []  : undefined;
      /* eslint-enable */

    if (typeVars) {
      const mockVars = ctorVars.concat(typeVars).join('\n');
      mocks[param.type] = `
        @Injectable()
        class Mock${param.type} {
          ${mockVars}
        }`;
    }
  });

  return mocks;
}

const NgTestData = {
  getInputs,
  getOutputs,
  getItBlocks,
  getImports,
  getProviders,
  getProviderMocks
};

module.exports = NgTestData;
