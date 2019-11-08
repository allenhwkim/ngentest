const {getImportLib, reIndent} = require('./lib/util.js');
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
  // Run only one test, transform()
  //
  let method = tsParsed.methods.transform;
  let parameters = method.parameters.map(el => el.name);

  const testName = `should run #transform()`;
  result.functionTests[testName] = reIndent(`
    it('${testName}', () => {
      // const pipe = new ${tsParsed.name}();
      // const result = pipe.transform(${parameters.join(', ')});
      // expect(result).toBe('<<EXPECTED>>');
    });
  `, '  ');

  return result;
}
