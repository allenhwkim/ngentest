const getImportLib = require('./lib/util.js').getImportLib;
const reIndent = require('./lib/util.js').reIndent;
const path = require('path');

module.exports = function getServiceData(tsParsed, filePath) {
  let result = {
    className: tsParsed.name,
    imports: {
      [`./${path.basename(filePath)}`.replace(/.ts$/,'')]: [tsParsed.name] // the directive itself
    },
    functionTests: {}
  };

  //
  // Iterate methods
  //  . Javascript to call the function with parameter;
  //
  for (var key in tsParsed.methods) {
    let method = tsParsed.methods[key];
    let parameters = method.parameters.map(el => el.name);
    let js = `${key}(${parameters.join(',')})`;
    (method.type !== 'void') && (js = `const result = ${js}`); 
    result.functionTests[key] = {
      parameters,
      body: reIndent(`
          it('should run #${key}()', async () => {
            // ${js};
          });
        `, '  ')
    };
  }

  return result;
}
