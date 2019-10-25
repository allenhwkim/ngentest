const fs = require('fs');
const { readSourceFile, ScriptTarget, ScriptKind } = require('typescript');
const { TypescriptParser } = require('typescript-parser');

class NgTypescriptParser {
  constructor(filePath, className) {
    // this.parsed;
    // this.klass;
    this.tsPath = filePath;
    this.typescript = fs.readFileSync(filePath, 'utf8');
    this.klassName = className;
  }

  async getKlass () {
    const parser = new TypescriptParser();
    // const srcFile = createSourceFile('inline.tsx', this.typescript, ScriptTarget.ES2015, true, ScriptKind.TS);
    // const parsed = parser['parseTypescript'](srcFile, '/');
    const parsed = await parser.parseSource(this.typescript);

    const klass = this.klassName ?
      parsed.declarations.find(decl => decl.name === this.klassName) :
      parsed.declarations.find(decl => decl.constructor.name === 'ClassDeclaration');

    if (!klass) {
      throw new Error(`Error:NgTypeScriptParser Could not find ` +
        `${this.klassName || 'a class'} from ${this.tsPath}`);
    }

    return klass;
  }

  async getImports () {
    const imports = {};

    const parser = new TypescriptParser();
    const parsed = await parser.parseSource(this.typescript);
    // const srcFile = createSourceFile('inline.tsx', this.typescript, ScriptTarget.ES2015, true, ScriptKind.TS);
    // const parsed = parser['parseTypescript'](srcFile, '/');
    parsed.imports.forEach( mport => {
      if (mport.constructor.name === 'NamedImport') {
        mport.specifiers.forEach(specifier => {
          imports[specifier.alias || specifier.specifier] = { mport, specifier };
        });
      } else if (mport.constructor.name === 'NamespaceImport') {
        imports[mport.alias || mport.libraryName] = { mport };
      }
    });

    return imports;
  }

}

module.exports = NgTypescriptParser;
