const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const defaultCompileOptions = {
    noEmitOnError: true, 
    experimentalDecorators: true,
    target: ts.ScriptTarget.ES2016, 
    module: ts.ModuleKind.CommonJS
  };

function createProgram(param1, options) {
  if (Array.isArray(param1)) {
    const fileNames = param1;

    return ts.createProgram(fileNames, options);
  } else {
    const sourceString = param1;
    let compilerHost = createCompilerHost(options, sourceString);
    compilerHost.getSourceFile = function getSourceFile(fileName, languageVersion, onError) {
      if (fileName === 'inline.ts') {
        return ts.createSourceFile(fileName, sourceString, languageVersion);
      } else {
        const sourceText = ts.sys.readFile(fileName);
        return sourceText !== undefined ? ts.createSourceFile(fileName, sourceText, languageVersion) : undefined;
      }
    }

    return ts.createProgram(['inline.ts'], options, compilerHost);
  }
}

function createCompilerHost(options, sourceString) {
  return {
    getSourceFile: (fileName, languageVersion, onError)  => {
      if (fileName === 'inline.ts') {
        return ts.createSourceFile(fileName, sourceString, languageVersion);
      } else { // it's also used to search other source file, e.g. lib.d.ts
        const sourceText = ts.sys.readFile(fileName);
        return sourceText !== undefined ? ts.createSourceFile(fileName, sourceText, languageVersion) : undefined;
      }
    },
    getDefaultLibFileName: () => ts.getDefaultLibFilePath(options),
    writeFile: (fileName, content) => ts.sys.writeFile(fileName, content),
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getDirectories: (path) => ts.sys.getDirectories(path),
    getCanonicalFileName: fileName => ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
    getNewLine: () => ts.sys.newLine,
    useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
    fileExists: filaName => ts.sys.fileExists(fileName),
    readFile: readFile => ts.sys.readFile(fileName),
    resolveModuleNames: (moduleNames, containingFile) => {
      const resolvedModules = [];
      for (const moduleName of moduleNames) {  // try to use standard resolution
        let result = ts.resolveModuleName(moduleName, containingFile, options, { 
          fileExists: ts.sys.fileExists, 
          readFile: ts.sys.readFile
        });
        result.resolvedModule ? 
          resolvedModules.push(result.resolvedModule) : console.error('ERROR', moduleName, containingFile);
      }
      return resolvedModules;
    }
  };
}

function getDiagnostics(program, printDiagnostics = false) {
  const emitResult = program.emit();
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  const diagnostics = [];

  allDiagnostics.forEach(diagnostic => {
    let code = diagnostic.code;
    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (diagnostic.file) {
      let fileName = diagnostic.file.fileName;
      let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      let fileMessage = fileName ? `${fileName} (${line + 1},${character + 1}) :` : '';

      diagnostics.push({fileName, line, character, code, message})
      printDiagnostics && console.log(fileMessage, 'TS'+code+':', message);
    } else {
      diagnostics.push({code, message})
      printDiagnostics && console.log('TS'+code+':', message);
    }
  });

  return diagnostics;
}

export function compileTypescript(param1, options, printDiagnostics) {
  const mergedOptions = Object.assign(defaultCompileOptions, options||{});
  const program = createProgram(param1, mergedOptions);
  const diagnostics = getDiagnostics(program, printDiagnostics);
  return diagnostics.length === 0;
}

// test with a typescript file
// let tsFile = path.resolve(__dirname, '../', 'examples', 'my.component.ts');
// assert(compileTypescript([tsFile], null, true));

// test with a typescript source code
// source = fs.readFileSync(tsFile, 'utf8');
// assert(compileTypescript(source, null, true));
