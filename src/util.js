const jsParser = require('acorn').Parser;
const path = require('path');
const indentJs = require('indent.js');

const strFuncRE = /^(slice|trim|substr|replace|split|toLowerCase|toUpperCase|match)$/;
const arrFuncRE = /^(forEach|map|reduce|slice|filter)$/;
const obsFuncRE = /^(subscribe|pipe|post|put)$/;

class Util {
  static get DEBUG () { return !!Util.__debug; }
  static set DEBUG (bool) { Util.__debug = bool; }

  static getCode(node, code) {
    return code.substring(node.start, node.end);
  }

  static isFunctionExpr (node) {
    return node.arguments &&
      node.arguments[0] &&
      node.arguments[0].type.match(/FunctionExpression/);
  }

  // returns function parameters as a named object
  // node.type Identifier, ObjectPattern, ArrayPattern 
  // e.g. function >>>> ([a,b,{c,d},[e,f]]) <<<< {} returns ['a', 'b', {c:{}, d: {}}, ['e', 'f']]
  static getObjFromVarPattern(node) {
    if (node.type === 'Identifier') {
      return node.name;
    } else if (node.type === 'ObjectPattern') {
      const obj = {};
      node.properties.forEach( prop => obj[prop.key.name] = {} );
      return obj;
    } else if (node.type === 'ArrayPattern') {
      const arr = [];
      node.elements.forEach( el => arr.push(Util.getObjFromVarPattern(el)) );
      return arr;
    }
  }

  static getAngularType (typescript) {
    return typescript.match(/^\s*@Component\s*\(/m) ? 'component' : /* eslint-disable */
      typescript.match(/^\s*@Directive\s*\(/m) ? 'directive' :
      typescript.match(/^\s*@Injectable\s*\(/m) ? 'service' :
      typescript.match(/^\s*@Pipe\s*\(/m) ? 'pipe' : 'obj'; /* eslint-enable */
  }

  static getClassName (tsPath) {
    return path.basename(tsPath)
      .replace(/\.[a-z]+$/, '') // remove extension
      .split(/[^a-z0-9]/i) // each word
      .map(el => el[0].toUpperCase() + el.slice(1)) // capitalize 1st ch.
      .join('');
  }

  static indent (str, prefix = '') {
    // const opts = Object.assign({ indent_size: 2 }, moreOpts);
    // return beautify(str, opts);
    str = indentJs.ts(str, { tabString: '  ' });
    str = str + prefix;
    str = str.replace(/\n/gm, '\n' + prefix);
    return str;
  }

  static getCallExhaustedReturn(obj) {
    const firstKey = typeof obj === 'object'
      && !Array.isArray(obj)
      && Object.keys(obj).filter(k => k !== 'undefined')[0];
    if (typeof obj === 'function') {
      return Util.getCallExhaustedReturn(obj);
    } else if (firstKey && typeof obj[firstKey] === 'function') {
      return Util.getCallExhaustedReturn(obj[firstKey]());
    } else {
      return obj;
    }
  }

  static objToJS (obj, level = 1) {
    const exprs = [];
    const indent = ' '.repeat(level * 2);
    const firstKey = typeof obj === 'object' && Object.keys(obj).filter(k => k !== 'undefined')[0];
    if (typeof obj === 'function') {
      const objRet = obj();
      const objRet1stKey = typeof objRet === 'object' &&
        Object.keys(objRet).filter(k => k !== 'undefined')[0];
      if (!objRet1stKey) {
        return 'jest.fn()';
      } else {
        const funcRet = Util.objToJS(objRet, level + 1);
        return `function() {\n${indent}  return ${funcRet};\n${indent}}`;
      }
    } else if (firstKey && firstKey.match(strFuncRE)) { // sring function
      return `'ngentest'`;
    } else if (firstKey && firstKey.match(arrFuncRE)) { // array function
      const paramArray = Util.getCallExhaustedReturn(obj);
      const paramValues =  [].concat(paramArray).map(el => {
        return Util.objToJS( Util.getCallExhaustedReturn(el));
      });

      return `[${paramValues.join(', ')}]`;
    } else if (firstKey && firstKey.match(obsFuncRE)) { // observable function
      const paramArray = Util.getCallExhaustedReturn(obj); // {}
      const paramValues = [].concat(paramArray).map(el => {
        return Util.objToJS( Util.getCallExhaustedReturn(el));
      });
      const valuesStr = paramValues.length ? paramValues.join(', ') : '{}';

      return `observableOf(${valuesStr})`;
    } else if (Array.isArray(obj)) {
      return JSON.stringify(obj, null, '  ');
    } else {
      for (var key in obj) {
        if (key === 'undefined' || !obj.hasOwnProperty(key)) { continue; }

        const obj1stKey = (typeof obj[key] === 'object') &&
          Object.keys(obj[key]).filter(k => k !== 'undefined')[0];
        if (typeof obj[key] === 'object' && !obj1stKey) { // is empty obj, e.g. {}
          exprs.push(`${key}: ${Util.objToJS(obj[key])}`);
        } else if (obj1stKey && obj1stKey.match(strFuncRE)) { // string in form of an object
          exprs.push(`${key}: '${key}'`);
        } else if (typeof obj[key] === 'object') {
          exprs.push(`${key}: ${Util.objToJS(obj[key], level + 1)}`);
        } else if (typeof obj[key] === 'function') {
          exprs.push(`${key}: ${Util.objToJS(obj[key], level + 1)}`);
        } else if (typeof obj[key] === 'string') {
          exprs.push(`${key}: "${obj[key]}"`);
        } else {
          exprs.push(`${key}: ${obj[key]}`);
        }
      }

      return !exprs.length ?  '{}' : '{\n' +
        exprs.map(el => { return `${indent}${el}`; }).join(',\n') +
        '\n' +
        indent.substr(2) + '}';
    }
  }

  /**
   * set value from source ONLY IF target value does not exists
   *
   * For example, assuming source is {foo: {bar: 1}}, and target is {foo: {baz: 2}}
   * AFter this function, target wil become { foo: {bar: 1, baz: 2}}
   */
  static assign (source, target) {
    const firstKey = Object.keys(source)[0];
    if (!target[firstKey]) {
      target[firstKey] = source[firstKey];
      return;
    }
    if (typeof source[firstKey] === 'function') {
      const sourceFuncRet = source[firstKey]();
      if (typeof sourceFuncRet === 'object') {
        const targetFuncRet = typeof source[firstKey] === 'function' ? target[firstKey]() : {};
        if (typeof targetFuncRet === 'string') { // ignore string values bcoz it's from var xxx = foo.bar()
          const mergedFuncRet = Object.assign({}, sourceFuncRet, {});
          target[firstKey] = function() { return mergedFuncRet; }
        } else {
          const mergedFuncRet = Object.assign({}, sourceFuncRet, targetFuncRet);
          target[firstKey] = function() { return mergedFuncRet; }
        }
        
      } else if (typeof sourceFuncRet === 'string') {
        target[firstKey] = function() { return sourceFuncRet; }
      }
    } else {
      Util.assign(source[firstKey], target[firstKey]);
      return;
    }
  }

  static getNode (code) {
    let parsed;

    if (code.replace(/\n/g,'').match(/^{.*}$/m)) {
      code = `(${code})`;
    }
    try {
      parsed = jsParser.parse(code);
    } catch (e) {
      throw new Error(`ERROR Util.getNode JS code is invalid, "${code}"`);
    }
    // const parsed = jsParser.parse(code);
    const firstNode = parsed.body[0];
    const node = firstNode.type === 'BlockStatement' ? firstNode.body[0] :
      firstNode.type === 'ExpressionStatement' ? firstNode.expression : null;
    return node;
  }

  /**
   * Returns expression members in array
   *
   * MemberExpression e.g., foo.bar().x -> [foo, bar, (), x]
   * CallExpression   e.g.  foo.x.bar() -> [foo, x, bar, ()]
   * ThisExpression   e.g.  this -> [this]
   * Identifier       e.g.  foo -> [foo]
   */
  static getExprMembers (code, result = []) {
    if (typeof code !== 'string') throw new Error('%%%%%%%%%%%%%%%%%');

    const node = Util.getNode(code);
    const { type, property, object, callee } = node;
    const member = /* eslint-disable */
      type === 'MemberExpression' ? property.name || property.raw :
      type === 'CallExpression' ? `(${Util.getFuncArgNames(code)})` :
      type === 'ThisExpression' ? 'this' :
      type === 'Identifier' ? node.name : undefined;
    member && result.push(member); /* eslint-enable */

    if (object) {
      const kode = Util.getCode(object, code);
      result = Util.getExprMembers(kode, result);
    } else if (callee) {
      const kode = Util.getCode(callee, code);
      result = Util.getExprMembers(kode, result);
    }
    return result;
  }

  /**
   * Build a Javascript object from expression by parsing expression members
   *
   * MemberExpression     e.g., foo.bar.x().y
   *   returns {foo: {bar: x: function() { return {y: {}}}}}
   * Identifier           e.g., foo
   *   returns {}
   * LogicalExpresssion   e.g., foo.bar.x().y || a.b
   *   returns {foo: {bar: x: function() { return {y: {}}}}}
   */
  static getFuncArgNames (code) {
    const node = Util.getNode(code);
    const argNames = node.arguments.map(arg => {
      if (arg.params && arg.params[0] && arg.params[0].name) {
        return arg.params[0].name;
      } else if (arg.params && arg.params[0] && arg.params[0].type === 'ArrayPattern') {
        return `ARR_PTRN`;
      } else if (arg.type === 'ArrayExpression') {
        return `[]`;
      } else if (typeof arg.value !== 'undefined') {
        return arg.raw || arg.value;
      } else if (arg.type === 'Identifier' && arg.name) {
        return arg.name;
      } else if (arg.type === 'BinaryExpression') return 'BIN_EXPR';
      else if (arg.type === 'ArrowFunctionExpression') return 'ARROW_FUNC_EXPR';
      else if (arg.type === 'FunctionExpression') return 'FUNC_EXPR';
      else if (arg.type === 'CallExpression') return 'CALL_EXPR';
      else if (arg.type === 'LogicalExpression') return 'LOGI_EXPR';
      else if (arg.type === 'MemberExpression') return 'MBR_EXPR';
      else if (arg.type === 'NewExpression') return 'NEW_EXPR';
      else if (arg.type === 'ObjectExpression') return 'OBJ_EXPR';
      else if (arg.type === 'TemplateLiteral') return 'TMPL_LTRL';
      else if (arg.type === 'ThisExpression') return 'THIS_EXPR';
      else if (arg.type === 'UnaryExpression') return 'UNRY_EXPR';
      else if (arg.type === 'ConditionalExpression') return 'COND_EXPR';
      else if (arg.type === 'SpreadElement') return '...' + arg.name;
      else {
        console.error('\x1b[31m%s\x1b[0m', `Invalid function argument expression`, arg);
        throw new Error(`Invalid function argument type, ${arg.type}`);
      }
    });
    return argNames.join(',');
  }

  /**
   * Build a Javascript object from expression by parsing expression members
   *
   * MemberExpression     e.g., foo.bar.x().y
   *   returns {foo: {bar: x: function() { return {y: {}}}}}
   * Identifier           e.g., foo
   *   returns {}
   * LogicalExpresssion   e.g., foo.bar.x().y || a.b
   *   returns {foo: {bar: x: function() { return {y: {}}}}}
   */
  static getObjectFromExpression (code, returns = {}) {
    if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%%';

    if (code.match(/yield /)) {
      code = code.replace(/yield /g, '');
    }

    const node = Util.getNode(code);
    const exprMembers = Util.getExprMembers(code);

    let nxt, obj;
    obj = exprMembers[0] && exprMembers[0].startsWith('(') ?
      function () { return returns; } : returns;
    exprMembers.forEach((str, ndx) => {
      nxt = exprMembers[ndx + 1];
      if (nxt && nxt.startsWith('(')) {
        const fnRet = { [str]: obj };
        obj = function () { return fnRet; };
      } else if (str && !str.startsWith('(')) {
        obj = { [str]: obj };
      }
    });

    return obj;
  }

  // returns parenthesis taken care of array.
  // e.g. Brom ['a','b', '(c)'] to ['a', 'b(c)']
  static getVars(code) {
    if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getVars';

    const members = Util.getExprMembers(code).reverse().join('.').replace(/\.\(/g, '(').split('.');
    let vars = [];
    let parenthesisOpen;

    members.forEach(el => {
      el = el.match(/^[0-9]$/) ? `[${el}]` : el; // change 12 to [12]

      if (parenthesisOpen) {
        const lastIndex = vars.length - 1;
        vars[lastIndex] = vars[lastIndex] + '.' + el;
      } else {
        vars.push(el);
      }

      parenthesisOpen =
        el.match(/\(.*\)$/) ? false :
        el.match(/\(/) ? true :
        el.match(/\)$/) ? false : parenthesisOpen;
    });
    return vars;
  };


  /**
   * if ends with something, return certain type.
   * e.g. for `foo.bar.substr(1)` , 'foo.bar' returns string
   * e.g. for 'foo.bar.subscribe(...)', 'foo.bar' returns Observable
   * e.g. for 'foo.bar.forEach(...)', 'foo.bar' returns array
   */
  static getExprReturn (code) {
    if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getExprReturn';

    // const code = classCode.substring(node.start, node.end);

    // const members = Util.getExprMembers(node).reverse();
    const vars = Util.getVars(code); // parenthesis taken care of array.
    const baseCode = vars.join('.')
      .replace(/\.\[/g, '[').replace(/\]\./g, ']'); // replace .[0]. to [0]

    // const baseCode = vars.join('.')
    //   .replace(/\.([0-9]+)\./, (_, $1) => `[${$1}].`) // replace .0. to [0]
    //   .replace(/\.([0-9]+)\./, (_, $1) => `[${$1}].`) // repeat
    //   .replace(/\.([0-9]+)$/, (_, $1) => `[${$1}]`);  // what if ends with .0
    const last = vars[vars.length - 1];

    try {
      jsParser.parse(baseCode);
    } catch (e) {
      throw new Error(`ERROR this JS code is invalid, "${baseCode}"`);
    }

    let ret;
    const node = Util.getNode(code);
    const funcExprArg = Util.isFunctionExpr(node) && node.arguments[0]; // if the first argument is a function
    if (funcExprArg) {
      const funcCode = code.substring(funcExprArg.start, funcExprArg.end);
      const paramObj = Util.getFuncParamObj(funcCode); // {param1: value1, param2: value2}
      // const value = values.length > 1 ? values : values[0]; // TODO, need to handle multiple function params?

      let value = [];
      funcExprArg.params.forEach( (param, index) => {
        if (param.type === 'ArrayPattern') {
          param.elements.forEach(prop => {
            let ret;
            if (prop.type === 'Identifier') {
              ret = paramObj[prop.name];
            } else if (prop.type === 'ArrayPattern') {
              ret = prop.elements.map(el => paramObj[el.name]);
            } else if (prop.type === 'ObjectPattern') {
              ret = {};
              prop.properties.forEach(prop => { 
                ret[prop.key.name] = paramObj[prop.key.name];
              });
            }
            value.push(ret);
          });
        } else if (param.type === 'ObjectPattern') {
          value[index] = {};
          param.properties.forEach(prop => { 
            value[index][prop.key.name] = paramObj[prop.key.name];
          });
        } else if (param.type === 'Identifier') {
          value[index] = paramObj[param.name];
        }
      });

      ret = { code: baseCode, value };
    } else {
      ret = { code: code, value: {} };
    }

    return ret;
  }

  /**
   *  Returns function param as an object from CallExpression
   *  e.g. 'foo.bar.x(event => { event.x.y.z() }' returns
   *    {x : { y: z: function() {} }}
   */
  static getFuncParamObj (code) { // CallExpression
    if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getFuncParamObj';

    const node = Util.getNode(code);
    if (!node.params.length)
      return false;

    const funcRetExprsRaw = Util.getParamExprs(code);
    const funcRetExprsFlat = funcRetExprsRaw.reduce((acc, val) => acc.concat(val), []);
    const funcRetExprs = Array.from(new Set(funcRetExprsFlat));

    const funcParam = {};
    (funcRetExprs || []).forEach(funcExpr => { // e.g., ['event.urlAfterRedirects.substr(1)', ..]
      const matches = funcExpr.match(/([\(\[])(['"]*)[^)]*$/); // 1: [ or ( 2: ' or "
      const endEncloser = matches && (matches[1] === '(' ? ')' : ']');
      // console.log('funcExpr..........', {funcExpr, matches, endEncloser});
      if (matches && !funcExpr.endsWith(endEncloser)) { // if parenthesis or [ not closed
        const [_, staEncloser, quotation] = matches;

        if (quotation && funcExpr.endsWith( staEncloser + quotation )) { // e.g. ...('
          funcExpr = `${funcExpr}${quotation}${endEncloser}`;
        } else if (quotation && funcExpr.endsWith( quotation )) { // e.g. ...('----'
          funcExpr = `${funcExpr}${endEncloser}`;
        } else if (quotation && !funcExpr.endsWith( quotation + endEncloser )) { // e.g. ('----
          funcExpr = `${funcExpr}${quotation}${endEncloser}`;
        } else {
          funcExpr = `${funcExpr}${endEncloser}`;
        }
      }

      // const exprNode = Util.getNode(funcExpr);
      const newReturn = Util.getExprReturn(funcExpr);
      const newCode = newReturn.code;
      const newValue = newReturn.value;
      const newNode = Util.getNode(newCode);
      const newObj = Util.getObjectFromExpression(newCode, newValue);
      // const source = newObj[Object.keys(newObj)[0]];
      Util.assign(newObj, funcParam);
    });

    return funcParam;
  }

  /**
   * returns function parameter related codes from the node
   */
  static getParamExprs (code) {
    const paramExprs = [];

    const paramNames1 = Util.getFuncParamNames(code);

    const paramNames = paramNames1.reduce((acc, val) => acc.concat(val), []);
    // const codeShortened = code.replace(/\n+/g, '').replace(/\s+/g, ' ');

    paramNames.forEach(paramName => {
      const paramNameMatchRE = new RegExp(`[^a-z]${paramName}(\\.[^\\s\\;\\)\\\+\\-\\]\\}\\,]+)+`, 'img')
      const matches = code.match(paramNameMatchRE);
      if (matches) {
        // remove the invalid first character. e.g. '\nmyParam.foo.bar'
        paramExprs.push(matches.map(el => el.slice(1))); 
      }
    });

    return paramExprs;
  }

  // returns function parameters names
  // e.g. function(a,b,{c,d},[e,f]) {...} returns ['a', 'b', 'c', 'd', 'e', 'f']
  static getFuncParamNames(code) {
    const names = [];
    const node = typeof code === 'string' ? Util.getNode(code) : code;

    if (node.type === 'Identifier') {
      names.push(node.name);
    } else if (node.type === 'ObjectPattern') {
      node.properties.forEach(prop => {
        names.push(prop.key.name);
      });
    } else if (node.type === 'ArrayPattern') {
      node.elements.forEach(el => {
        const elPropName = Util.getFuncParamNames(el);
        names.push(elPropName);
      });
    } else if (node.params) {
      node.params.forEach(param => {
        const elPropName = Util.getFuncParamNames(param);
        names.push(elPropName);
      });
    } else {
      throw new Error(`ERROR getFuncParamNames type error, "${node.type}"`);
    }

    return names.reduce((acc, val) => acc.concat(val), []);
  }

  static getFuncMockJS (mockData, thisName = 'component') {
    const js = [];

    Object.entries(mockData.props).forEach(([key1, value]) => {

      if (typeof value === 'function') {
        const funcRetVal = value();
        if (typeof funcRetVal === 'string' || Object.keys(funcRetVal).length === 0) { // e.g.{}, or  myVar from `const myVar = this.foo.var();`
          js.push(`${thisName}.${key1} = jest.fn()`);
        } else {
          js.push(`${thisName}.${key1} = jest.fn().mockReturnValue(${Util.objToJS(funcRetVal)})`);
        }
      } else {
        const valueFiltered = Object.entries(value).filter(([k, v]) => k !== 'undefined');
        valueFiltered.forEach(([key2, value2]) => {

          js.push(`${thisName}.${key1} = ${thisName}.${key1} || {}`);
          if (typeof value2 === 'function' && key2.match(/^(post|put)$/)) {
            js.push(`${thisName}.${key1}.${key2} = jest.fn().mockReturnValue(observableOf('${key2}'))`);
          } else if (key2.match(arrFuncRE)) {
            if (typeof value2[key2] === 'function') {
              const arrElValue = value2[key2]();
              const arrElValueJS = Util.objToJS(arrElValue);
              js.push(`${thisName}.${key1} = ${arrElValueJS}`);
            } else {
              js.push(`${thisName}.${key1} = ['${key1}']`);
            }
          } else if (typeof value2 === 'function' && JSON.stringify(value2()) === '{}') {
            const funcRetVal = value2();
            const funcRet1stKey = Object.keys(funcRetVal).filter(el => el !== 'undefined')[0];
            if (typeof funcRetVal === 'object' && ['toPromise'].includes(funcRet1stKey)) {
              const retStr = Util.objToJS(funcRetVal[funcRet1stKey]());
              js.push(`${thisName}.${key1}.${key2} = jest.fn().mockReturnValue(observableOf(${retStr}))`);
            } else if (typeof funcRetVal === 'object' && ['filter'].includes(funcRet1stKey)) {
              const retStr = Util.objToJS(funcRetVal[funcRet1stKey]());
              js.push(`${thisName}.${key1}.${key2} = jest.fn().mockReturnValue([${retStr}])`);
            } else if (typeof funcRetVal === 'object' && funcRet1stKey) {
              js.push(`${thisName}.${key1}.${key2} = jest.fn().mockReturnValue(${Util.objToJS(funcRetVal)})`);
            } else {
              js.push(`${thisName}.${key1}.${key2} = jest.fn()`);
            }
            // const funcRetValEmpty = Object.as`funcRetVal
          } else if (['length'].includes(key2)) {
            // do nothing
          } else if (typeof value2 === 'function') {
            const funcRetVal = value2();
            if (typeof funcRetVal === 'string' || Object.keys(funcRetVal).length === 0) { // e.g. myVar from `const myVar = this.foo.var();`
              js.push(`${thisName}.${key1}.${key2} = jest.fn()`);
            } else {
              js.push(`${thisName}.${key1}.${key2} = jest.fn().mockReturnValue(${Util.objToJS(funcRetVal)})`);
            }
          } else if (Array.isArray(value2)) {
            // const fnValue2 = Util.objToJS(value2).replace(/\{\s+\}/gm, '{}');
            js.push(`${thisName}.${key1}.${key2} = ['gentest']`);
          } else {
            const objVal21stKey = Object.keys(value2)[0];
            if (objVal21stKey && objVal21stKey.match(arrFuncRE)) {
              if (typeof value2[objVal21stKey] === 'function') {
                const arrElValue = value2[objVal21stKey]();
                const arrElValueJS = Util.objToJS(arrElValue);
                js.push(`${thisName}.${key1}.${key2} = ${arrElValueJS}`);
              } else {
                js.push(`${thisName}.${key1}.${key2} = ['${key2}']`);
              }
            } else if (objVal21stKey && objVal21stKey.match(strFuncRE)) {
              js.push(`${thisName}.${key1}.${key2} = '${key2}'`);
            } else {
              const objValue2 = Util.objToJS(value2).replace(/\{\s+\}/gm, '{}');
              if (objValue2 === '{}') {
                js.push(`${thisName}.${key1}.${key2} = '${key2}'`);
              } else {
                js.push(`${thisName}.${key1}.${key2} = ${objValue2}`);
              }
            }
          }
        });

      }

    });

    Object.entries(mockData.globals).forEach(([key1, value]) => { // window, document
      Object.entries(value).forEach(([key2, value2]) => { // location
        if (typeof value2 === 'function') {
          js.push(`${key1}.${key2} = jest.fn()`);
        } else {
          Object.entries(value2).forEach(([key3, value3]) => { // location
            if (typeof value3 === 'function') {
              js.push(`${key1}.${key2}.${key3} = jest.fn()`);
            } else if (value3) {
              const objValue3 = Util.objToJS(value3).replace(/\{\s+\}/gm, '{}');
              js.push(`${key1}.${key2}.${key3} = ${objValue3}`);
            }
          });
        }
      });
    });

    return js;
  }

  static getFuncParamJS (params) {
    const js = [];
    Object.entries(params).forEach(([key2, value2]) => {
      const value21stKey = typeof value2 === 'object' &&
        Object.keys(value2).filter(k => k !== 'undefined')[0];

      if (key2 !== 'undefined') {
        const objValue2 = Util.objToJS(value2);
        const jsValue = 
          objValue2 === `'ngentest'` ? `'${key2}'` :
          objValue2 === `['ngentest']` ? `['${key2}']` :
           `${objValue2}`
        js.push(`${jsValue}`);
      }
    });

    return js.join(', ');
  }

}

module.exports = Util;
