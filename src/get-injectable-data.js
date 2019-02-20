const {getImportLib, reIndent} = require('./lib/util.js');
const path = require('path');

module.exports = function getServiceData(tsParsed, filePath) {
  let result = {
    className: tsParsed.name,
    classParams: [],
    imports: {
      [`./${path.basename(filePath)}`.replace(/.ts$/,'')]: [tsParsed.name], // the directive itself
    },
    mocks: {},
    functionTests: {}
  };

  //
  // Iterate constructor parameters
  //  . create mocks and constructor parameters
  //
  (tsParsed.constructor.parameters || []).forEach(param => { // name, type, body
    //param.type, param.name, param.body
    result.mocks[param.type] = reIndent(`
      const ${param.name}: any = {
        // mock properties here 
      }
    `, '  ');

    result.classParams.push(param.name);
  });

  //
  // Iterate methods
  //  . Javascript to call the function with parameter;
  //
  for (var key in tsParsed.methods) {
    let method = tsParsed.methods[key];
    let parameters = (method.parameters || []).map(el => el.name).join(', ');
    let js = `${key}(${parameters})`;
    (method.type !== 'void') && (js = `const result = ${js}`); 
    const testName = `should run #${key}()`;
    result.functionTests[testName] = reIndent(`
      it('${testName}', async () => {
        // ${js};
      });
    `, '  ');
  }

  return result;
}
