import * as fs from 'fs';
import { TypescriptParser } from 'typescript-parser';
import { createSourceFile, ScriptTarget, ScriptKind } from 'typescript';

export class NgTypescriptParser {
  typescript: string;
  klassName: string;
  parsed: any;
  klass: any;
  tsPath: string;

  constructor(filePath, className?) {
    this.tsPath = filePath;
    this.typescript = fs.readFileSync(filePath, 'utf8');
    this.klassName = className;
  }

  async getKlass() {
    const parser = new TypescriptParser();
    // const srcFile = createSourceFile('inline.tsx', this.typescript, ScriptTarget.ES2015, true, ScriptKind.TS);
    // const parsed = parser['parseTypescript'](srcFile, '/');
    const parsed: any = await parser.parseSource(this.typescript);

    const klass = this.klassName ?
      parsed.declarations.find(decl => decl.name === this.klassName) :
      parsed.declarations.find(decl => decl.constructor.name === 'ClassDeclaration');

    if (!klass) {
      throw new Error(`Error:NgTypeScriptParser Could not find ` +
        `${this.klassName || 'a class'} from ${this.tsPath}`);
    }

    return klass;
  }

  async getImports() {
    const imports = {};

    const parser = new TypescriptParser();
    const parsed: any = await parser.parseSource(this.typescript);
    // const srcFile = createSourceFile('inline.tsx', this.typescript, ScriptTarget.ES2015, true, ScriptKind.TS);
    // const parsed = parser['parseTypescript'](srcFile, '/');
    parsed.imports.forEach( (mport: any) => {
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
