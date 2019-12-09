const path = require('path');
const fs = require('fs');

const Base = require('../common-gen-functions.js');

class ComponentTestGen {
  constructor (tsPath, config) {
    if (tsPath && fs.existsSync(tsPath)) {
      this.tsPath = tsPath;
      this.config = config;
    } else {
      throw new Error(`Error. invalid typescript file. e.g., Usage $0 ${tsPath} [options]`);
    }

    this.tsPath = tsPath;
    this.typescript = fs.readFileSync(path.resolve(tsPath), 'utf8');
    this.template = fs.readFileSync(path.join(__dirname, 'component.template.ts.ejs'), 'utf8');

    this.klass = Base.getKlass.bind(this)();
    this.imports = Base.getImports.bind(this)();
    this.klassProperties = Base.getKlassProperties.bind(this)();
    this.klassGetters = Base.getKlassGetters.bind(this)(),
    this.klassSetters = Base.getKlassSetters.bind(this)(),
    this.klassMethods = Base.getKlassMethods.bind(this)(),

    this.getProviderMocks = Base.getProviderMocks.bind(this);
    this.getGenerated = Base.getGenerated.bind(this);
    this.writeGenerated = Base.writeGenerated.bind(this);
  }

  getData () {
    const angularType = Base.getAngularType.bind(this)();
    const typescript = this.typescript;

    const ejsData = {
      className: this.klass.node.name.escapedText,
      importMocks: Base.getImportMocks.bind(this)(),
      inputMocks: Base.getInputMocks.bind(this)(),
      outpuMocks: Base.getOutputMocks.bind(this)(),
      componentProviderMocks: Base.getComponentProviderMocks.bind(this)()
    }

    return {angularType, typescript, ejsData};
  }

}

module.exports = ComponentTestGen;
