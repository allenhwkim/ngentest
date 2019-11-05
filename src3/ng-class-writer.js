const fs = require('fs');
const path = require('path');
const NgTypescriptParser = require('./ng-typescript-parser.js');
const ComponentData = require('./for-component/component-data.js');
const jsParser = require('acorn').Parser;

class NgClassWriter {
  constructor (tsPath) {
    // this.klass;
    // this.tsPath;
    // this.specPath;
    // this.generated;

    if (tsPath && fs.existsSync(tsPath)) {
      this.tsPath = tsPath;
    } else {
      throw new Error(`Error. invalid typescript file. e.g., Usage $0 ${tsPath} [options]`);
    }
  }

  async getData () {
    const angularType = this.getAngularType();
    const parser = new NgTypescriptParser(this.tsPath);
    const tsPath = this.tsPath;
    const klass = await parser.getKlass();
    const imports = await parser.getImports();
    const typescript = fs.readFileSync(path.resolve(this.tsPath), 'utf8');

    const testGenerator =
      angularType === 'Component' ? new ComponentData({ tsPath, klass, imports }) : {};
    const ejsData = testGenerator.getEjsData();

    this.testGenerator = testGenerator;

    return { klass, imports, parser, typescript, ejsData };
  }

  getGenerated (ejsData) {
    const generated = this.testGenerator.getGenerated(ejsData);
    return generated;
  }

  getProviderMocks (klass, ctorParams) {
    return this.testGenerator._getProviderMocks(klass, ctorParams);
  }

  getTSParsed (klass, funcName) {
    return funcName === 'constructor' ? klass.ctor : klass.methods.find(method => method.name === funcName);
  }

  getJSParsed (klass, funcName) {
    const jsCode = '' + klass.prototype.constructor;
    const jsParsed = jsParser.parse(jsCode);
    const jsKlass = jsParsed.body[0];
    const jsMethods = jsKlass.body.body;

    return jsMethods.find(node => node.key.name === funcName);
  }

  getJSCode (klass, node) {
    const jsCode = '' + klass.prototype.constructor;
    const nodeCode = jsCode.substring(node.start, node.end);

    return nodeCode;
  }

  getAngularType () {
    const typescript = fs.readFileSync(path.resolve(this.tsPath), 'utf8');
    return typescript.match(/^@Component\(/m) ? 'Component' :
      typescript.match(/^@Directive\(/m) ? 'Directive' :
        typescript.match(/^@Injectable\(/m) ? 'Injectable' :
          typescript.match(/^@Pipe\(/m) ? 'Pipe' : undefined;
  }

  writeGenerated (generated, toFile) {
    const specPath = path.resolve(this.tsPath.replace(/\.ts$/, '.spec.ts'));

    if (toFile && fs.existsSync(specPath)) {
      const backupTime = (new Date()).toISOString().replace(/[^\d]/g, '').slice(0, -9);
      const backupContents = fs.readFileSync(specPath, 'utf8');
      fs.writeFileSync(`${specPath}.${backupTime}`, backupContents, 'utf8'); // write backup
      fs.writeFileSync(specPath, generated);
      console.log('Generated unit test to', specPath);
    } else {
      process.stdout.write(generated);
    }
  }

  _getExistingTests () {
    const existingItBlocks = {};
    const specPath = path.resolve(this.tsPath.replace(/\.ts$/, '.spec.ts'));

    if (fs.existsSync(specPath)) {
      const contents = fs.readFileSync(specPath, 'utf8');
      (contents.match(/  it\('.*?',.*?\n  }\);/gs) || []).forEach(itBlock => {
        const key = itBlock.match(/it\('(.*?)',/)[1];
        existingItBlocks[key] = `\n${itBlock}\n`;
      });
    }

    return existingItBlocks;
  }

}

module.exports = NgClassWriter;
