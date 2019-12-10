const path = require('path');
const fs = require('fs');

const Base = require('../common-test-gen.js');

class PipeTestGen {
  constructor (tsPath, config) {
    if (tsPath && fs.existsSync(tsPath)) {
      this.tsPath = tsPath;
      this.config = config;
    } else {
      throw new Error(`Error. invalid typescript file. e.g., Usage $0 ${tsPath} [options]`);
    }

    this.tsPath = tsPath;
    this.typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');
    this.template = fs.readFileSync(path.join(__dirname, 'pipe.template.ts.ejs'), 'utf8');

    this.klass = Base.getKlass.bind(this)();
    this.imports = Base.getImports.bind(this)();
    this.angularType = Base.getAngularType.bind(this)().toLowerCase();
    this.klassProperties = Base.getKlassProperties.bind(this)();
    this.klassGetters = Base.getKlassGetters.bind(this)(),
    this.klassSetters = Base.getKlassSetters.bind(this)(),
    this.klassMethods = Base.getKlassMethods.bind(this)(),

    this.getProviderMocks = Base.getProviderMocks.bind(this);
    this.getGenerated = Base.getGenerated.bind(this);
    this.writeGenerated = Base.writeGenerated.bind(this);
  }

  getData () {
    const ejsData = {
      className: this.klass.node.name.escapedText,
      importMocks: Base.getImportMocks.bind(this)(),
      inputMocks: Base.getInputMocks.bind(this)(),
      outputMocks: Base.getOutputMocks.bind(this)(),
      componentProviderMocks: Base.getComponentProviderMocks.bind(this)(),
      selector: Base.getDirectiveSelector.bind(this)(),

      ctorParamJs: undefined, // declarition only, will be set from mockData
      providerMocks: undefined, //  declarition only, will be set from mockData
      accessorTests: undefined, //  declarition only, will be set from mockData
      functionTests: undefined //  declarition only, will be set from mockData
    }

    return {ejsData};
  }
}

module.exports = PipeTestGen;
