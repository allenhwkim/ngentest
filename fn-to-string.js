
// convert object to string including function
function objToString(obj, level = 1) {
  const exprs = [];
  const indent = ' '.repeat(level * 2);
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) { continue; }
    if (typeof obj[key] === 'object') {
      exprs.push(`${key}: ${fnToString(obj[key], level + 1)}`);
    } else if (typeof obj[key] === 'function') {
      exprs.push(`${key} : ` +
        `function() {\n` +
        `${indent}  return ${fnToString(obj[key](), level + 2)};` +
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

const str = fnToString({
  this: {
    authGuardSvc: {
      foo: function () {
        return {
          bar: {
            baz: function () {
              return {
                isLoggedIn: [1,2,3]
              };
            }
          }
        };
      }
    }
  }
});

console.log(str);