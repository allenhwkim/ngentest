const fs = require('fs');
const TypescriptParser = require('typescript-parser').TypescriptParser;
const parser = new TypescriptParser();

async function parseTypescript(fileOrTs, className) {
  const fileContents = fs.existsSync(fileOrTs) ? fs.readFileSync(fileOrTs, 'utf8') : fileOrTs;
  const parsed = await parser.parseSource(fileContents);

  // find class declarations
  const klassDeclaraion = className ?
    parsed.declarations.find(decl => decl.name === className) :
    parsed.declarations.find(decl => decl.constructor.name === 'ClassDeclaration'); 
  const klass = klassDeclaraion || parsed.declarations[0];

  // find imports
  const imports = parsed.imports.map(mport => {
    if (mport.constructor.name === 'NamedImport') {
      //  { libraryName: '@angular/core', specifiers: [Array], ... }
      let specifiers = (mport.specifiers || [])
        .map(el => `${el.specifier}${el.alias ? ' as ' + el.alias : ''}`);
      return { from: mport.libraryName, specifiers };
    } else if (mport.constructor.name === 'NamespaceImport') {
      // { libraryName: 'lodash', alias: '_', start: 51, end: 79 }
      return { from: mport.libraryName, as: mport.alias };
    }
  });

  // constructor
  const constructor = {};
  if (klass.ctor) {
    constructor.parameters = (klass.ctor.parameters || []).map(param => {
      return {
        name: param.name,
        type: param.type,
        body: fileContents.substring(param.start, param.end)
      };
    });
    constructor.body = fileContents
      .substring(klass.ctor.start, klass.ctor.end)
      .match(/{([\s\S]*)\}$/m)[1];
  }

  // properties
  const properties = {};
  (klass.properties || []).forEach(prop => {
    properties[prop.name] = {
      type: prop.type,
      body: fileContents.substring(prop.start, prop.end)
    };
  });

  // methods
  const methods = {};
  (klass.methods || []).forEach(method => {
    methods[method.name] = {
      type: method.type,
      parameters: (method.parameters || []).map(param => ({
        name: param.name, type: param.type
      })),
      body: fileContents.substring(method.start, method.end).match(/{([\s\S]*)\}$/m)[1]
    };
  });

  return {
    name: klass.name,
    imports,
    properties,
    methods
  };
}

module.exports = parseTypescript;
