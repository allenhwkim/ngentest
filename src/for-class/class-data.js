const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const Base = require('../ng-test-data.js');

class ClassData {
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

  getEjsData () {
    const result = {};
    this.template = fs.readFileSync(path.join(__dirname, 'class.template.ts.ejs'), 'utf8');

    result.className = this.klass.name;
    result.inputs = this._getInputs(this.klass);
    result.outputs = this._getOutputs(this.klass);
    result.providers = this._getProviders(this.klass);
    result.functionTests = this._getItBlocks(this.klass);
    result.imports = this._getImports(this.klass);
    result.parsedImports = this.imports;

    return result;
  }

  getGenerated (ejsData) {
    const generated = ejs.render(this.template, ejsData).replace(/\n\s+$/gm, '\n');
    return generated;
  }

}

module.exports = ClassData;
