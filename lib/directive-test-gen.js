const CommonTestGen = require('./common-test-gen.js');

class DirectiveTestGen {
  constructor (typescript, config) {
    this.config = config;
    this.typescript = typescript;
    this.tsPath = config.tsPath;
    this.template = (config.templates || config.outputTemplates).directive;

    this.klass = CommonTestGen.getKlass.bind(this)();
    this.imports = CommonTestGen.getImports.bind(this)();
    this.angularType = CommonTestGen.getAngularType.bind(this)().toLowerCase();
    this.klassProperties = CommonTestGen.getKlassProperties.bind(this)();
    this.klassGetters = CommonTestGen.getKlassGetters.bind(this)(),
    this.klassSetters = CommonTestGen.getKlassSetters.bind(this)(),
    this.klassMethods = CommonTestGen.getKlassMethods.bind(this)(),

    this.getProviderMocks = CommonTestGen.getProviderMocks.bind(this);
    this.getGenerated = CommonTestGen.getGenerated.bind(this);
  }

  getData () {
    const ejsData = {
      className: this.klass.node.name.escapedText,
      importMocks: CommonTestGen.getImportMocks.bind(this)(),
      inputMocks: CommonTestGen.getInputMocks.bind(this)(),
      outputMocks: CommonTestGen.getOutputMocks.bind(this)(),
      componentProviderMocks: CommonTestGen.getComponentProviderMocks.bind(this)(),
      selector: CommonTestGen.getDirectiveSelector.bind(this)(),

      constructorParamJs: undefined, // declarition only, will be set from mockData
      providerMocks: undefined, //  declarition only, will be set from mockData
      accessorTests: undefined, //  declarition only, will be set from mockData
      functionTests: undefined //  declarition only, will be set from mockData
    }

    return {ejsData};
  }
}

module.exports = DirectiveTestGen;
