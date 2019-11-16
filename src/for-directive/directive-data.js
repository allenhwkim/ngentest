const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const Base = require('../ng-test-data.js');

class DirectiveData {
  constructor ({ tsPath, klass, imports }) {
    // this.template;
    this.imports = imports;
    this.klass = klass;

    this.tsPath = tsPath;
    this.typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');

    this._getInputs = Base.getInputs.bind(this);
    this._getOutputs = Base.getOutputs.bind(this);
    this._getItBlocks = Base.getItBlocks.bind(this);
    this._getImports = Base.getImports.bind(this);
    this._getProviders = Base.getProviders.bind(this);
    this._getProviderMocks = Base.getProviderMocks.bind(this);
  }

  getSelector (typescript) {
    const re = /@Directive\s*\(\s*{[^}]+selector:\s*['"](.*)['"]/
    const str = typescript.match(re)[1];
    if (str.match(/^\[/)) {
      return { type: 'attribute', name: str.match(/[^\[\]]+/)[0] };
    } else if (str.match(/^\./)) {
      return { type: 'class', name: str.match(/[^\.]+/)[0] };
    } else if (str.match(/^[a-z]/i)) {
      return { type: 'element', name: str.match(/[a-z-]+/)[0] };
    }
  }

  getEjsData () {
    const result = {};
    this.template = fs.readFileSync(path.join(__dirname, 'directive.template.ts.ejs'), 'utf8');

    result.className = this.klass.name;
    result.inputs = this._getInputs(this.klass);
    result.outputs = this._getOutputs(this.klass);
    result.providers = this._getProviders(this.klass);
    // result.windowMocks = this._getWindowMocks(this.klass);
    result.functionTests = this._getItBlocks(this.klass);
    result.imports = this._getImports(this.klass);
    result.parsedImports = this.imports;
    result.selector = this.getSelector(this.typescript);

    return result;
  }

  getGenerated (ejsData) {
    const generated = ejs.render(this.template, ejsData).replace(/\n\s+$/gm, '\n');
    return generated;
  }

}

module.exports = DirectiveData;
