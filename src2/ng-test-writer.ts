import * as fs from 'fs';
import * as path from 'path';

import { NgTypescriptParser } from './ng-typescript-parser';
import { ComponentData } from './for-component/component-data';

export class NgTestWriter {
  tsPath: string;
  specPath: string;
  generated: string;

  constructor(tsPath) {
    if (tsPath && fs.existsSync(tsPath)) {
      this.tsPath = tsPath;
    } else {
      throw new Error(`Error. invalid typescript file. e.g., Usage $0 ${tsPath} [options]`);
    }
  }

  getTestGenerator() {
    const angularType = this.getAngularType();
    return angularType === 'Component' ? new ComponentData(this.tsPath) : {};
  }

  getAngularType() {
    const typescript = fs.readFileSync(path.resolve(this.tsPath), 'utf8');
    return typescript.match(/^@Component\(/m) ? 'Component' :
      typescript.match(/^@Directive\(/m) ? 'Directive' :
      typescript.match(/^@Injectable\(/m) ? 'Injectable' :
      typescript.match(/^@Pipe\(/m) ? 'Pipe' : undefined;
  }

  writeGenerated(generated, toFile) {
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

  private getExistingTests() {
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
