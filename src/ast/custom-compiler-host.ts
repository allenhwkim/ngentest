import * as ts from 'typescript';

const filename = 'test.ts';
const code = `const test: number = 1 + 2;`;

const sourceFile = ts.createSourceFile(
  filename, code, ts.ScriptTarget.Latest
);

const defaultCompilerHost = ts.createCompilerHost({});

const customCompilerHost: ts.CompilerHost = {
  getSourceFile: (name, languageVersion) => {
    console.log(`getSourceFile ${name}`);

    if (name === filename) {
      return sourceFile;
    } else {
      return defaultCompilerHost.getSourceFile(
        name, languageVersion
      );
    }
  },
  writeFile: (filename, data) => {},
  getDefaultLibFileName: () => 'lib.d.ts',
  useCaseSensitiveFileNames: () => false,
  getCanonicalFileName: filename => filename,
  getCurrentDirectory: () => '',
  getNewLine: () => '\n',
  getDirectories: () => [],
  fileExists: () => true,
  readFile: () => ''
};

const program = ts.createProgram(
  ['test.ts'], {}, customCompilerHost
);
