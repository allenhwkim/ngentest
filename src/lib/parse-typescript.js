const fs = require('fs');
const TypescriptParser = require('typescript-parser').TypescriptParser;
const parser = new TypescriptParser();

module.exports = async function parseTypescript(fileOrTs, className){
  let parsed, fileContents;
  
  if (fs.existsSync(fileOrTs)) {
    fileContents = fs.readFileSync(fileOrTs, 'utf8');
    parsed = await parser.parseFile(filePath);
  } else {
    fileContents = fileOrTs; 
    parsed = await parser.parseSource(fileOrTs);
  }

  let ret = { imports: [], properties: {}, methods: {} };

  let klass;
  if (className) {
    klass = parsed.declarations.find(decl => decl.name === className);
  } else {
    klass = parsed.declarations.find(decl => decl.constructor.name === 'ClassDeclaration')
    klass = klass || parsed.declarations[0];
  }
  ret.name = klass.name;

  // imports
  parsed.imports.forEach(mport => {
    let specifiers;
    //  { libraryName: '@angular/core', specifiers: [Array], ... }
    if (mport.constructor.name === 'NamedImport') {   
      let specifiers = (mport.specifiers || []).map(el => `${el.specifier}${el.alias ? ' as '+el.alias: ''}`);
      ret.imports.push({from: mport.libraryName, specifiers});
    } // { libraryName: 'lodash', alias: '_', start: 51, end: 79 }
    else if (mport.constructor.name === 'NamespaceImport') {
      ret.imports.push({from: mport.libraryName, as: mport.alias});
    }
  })

  // constructor
  let constructor = klass.ctor;
  if (constructor) {
    ret.constructor = {};
    ret.constructor.parameters = (constructor.parameters || []).map(param => {
      return { 
        name: param.name,
        type: param.type,
        body: fileContents.substring(param.start, param.end)
      };
    });
    ret.constructor.body = fileContents
      .substring(constructor.start, constructor.end)
      .match(/{([\s\S]*)\}$/m)[1];
  }

  // properties 
  (klass.properties || []).forEach(prop => {
    ret.properties[prop.name] = {
      type: prop.type,
      body: fileContents.substring(prop.start, prop.end)
    };
  });

  // methods
  (klass.methods || []).forEach(method => {
    ret.methods[method.name] = {
      type: method.type,
      parameters: (method.parameters || []).map(param => ({
        name: param.name, type: param.type
      })),
      body: fileContents.substring(method.start, method.end).match(/{([\s\S]*)\}$/m)[1]
    }
  })

  return ret;
}
