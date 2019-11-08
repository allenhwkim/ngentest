const fs = require('fs');
const path = require('path'); 

function getAngularType(typescript) {
  return typescript.match(/^@Component\(/m) ? 'Component': 
    typescript.match(/^@Directive\(/m) ? 'Directive': 
    typescript.match(/^@Injectable\(/m) ? 'Injectable': 
    typescript.match(/^@Pipe\(/m) ? 'Pipe':  undefined;
}

function getEjsTemplate(type) {
  let ejsFile; 
  switch(type) {
    case 'Component':
    case 'Directive':
    case 'Pipe':
    case 'Injectable':
      const typeLower = type.toLowerCase();
      ejsFile = path.join(__dirname, '../', 'templates', `${typeLower}.spec.ts.ejs`);
      break;
    default:
      ejsFile = path.join(__dirname, '../', 'templates', `default.spec.ts.ejs`);
      break;
  }

  return fs.readFileSync(ejsFile, 'utf8');
}

function getImportLib(mports, className) {
  let lib;
  mports.forEach(mport => {
    if (mport.specifiers) {
      mport.specifiers.forEach(el => { // e.g. 'Inject', 'Inject as foo'
        if (el.indexOf(className) !== -1) {
          lib = mport.from; // e.g. '@angular/core'
        }
      });
    } else {
      lib = mport.from;
    }
  });

  return lib;
}

function reIndent(str, prefix="") {
  let toRepl = str.match(/^\n\s+/)[0];
  let regExp = new RegExp(toRepl, 'gm');
  return str.replace(regExp, "\n" + prefix);
}

function createBackupFile(filePath) {
  const ext = (new Date()).toISOString().replace(/[^\d]/g,'').slice(0, -9);
  const contents = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(`${filePath}.${ext}`, contents, 'utf8');
}

module.exports = {
  getAngularType,
  getEjsTemplate,
  getImportLib,
  reIndent,
  createBackupFile
};
