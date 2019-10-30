
// convert object to string including function
function objToString(obj, level = 1) {
  const exprs = [];
  const indent = ' '.repeat(level * 2);
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) { continue; }
    if (typeof obj[key] === 'object') {
      exprs.push(`${key}: ${objToString(obj[key], level + 1)}`);
    } else if (typeof obj[key] === 'function') {
      exprs.push(`${key} : ` +
        `function() {\n` +
        `${indent}  return ${objToString(obj[key](), level + 2)};` +
        '\n' +
        `${indent}}`);
    } else if (typeof obj[key] === 'string') {
      exprs.push(`${key}: "${obj[key]}"`);
    } else {
      exprs.push(`${key}: ${obj[key]}`);
    }
  }
  return '{\n' +
    exprs.map(el => { return `${indent}${el}`; }).join(',\n') + 
    '\n' +
  indent.substr(2) + '}';
}

module.exports = { objToString };
