const path = require('path');
const fs = require('fs');

const Base = require('../ng-test-data.js');
const NgTypescriptParser = require('../ng-typescript-parser');

class ClassData {
  constructor (tsPath) {
    // this.template;
    if (tsPath && fs.existsSync(tsPath)) {
      this.tsPath = tsPath;
    } else {
      throw new Error(`Error. invalid typescript file. e.g., Usage $0 ${tsPath} [options]`);
    }

    this.tsPath = tsPath;
    this.parser = new NgTypescriptParser(this.tsPath);
    this.typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');

    this._getInputs = Base.getInputs.bind(this);
    this._getOutputs = Base.getOutputs.bind(this);
    this._getItBlocks = Base.getItBlocks.bind(this);
    this._getImports = Base.getImports.bind(this);
    this._getProviders = Base.getProviders.bind(this);
    this.getProviderMocks = Base.getProviderMocks.bind(this);
    this.getGenerated = Base.getGenerated.bind(this);
    this.writeGenerated = Base.writeGenerated.bind(this);
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

  async getData () {
    this.klass = await this.parser.getKlass();
    this.imports = await this.parser.getImports();

    return {
      klass: this.klass,
      imports: this.imports,
      typescript: this.typescript,
      parser: this.parser,
      ejsData: this.getEjsData()
    };
  }

}

module.exports = ClassData;
