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
      const objRet1stKey = Util.getFirstKey(objRet);
      if (!objRet1stKey) {
        return 'function() {}';
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

        const obj1stKey = Util.getFirstKey(obj[key]);
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
  static merge (source, target) {
    const firstKey = Object.keys(source)[0];
    if (firstKey && !target[firstKey]) {
      target[firstKey] = source[firstKey];
    } else if (typeof source[firstKey] === 'function') {
      const sourceFuncRet = source[firstKey]();

      if (typeof sourceFuncRet === 'object') {
        const targetFuncRet = typeof source[firstKey] === 'function' ? target[firstKey]() : {};
        const isTarget0EmptyObj =  targetFuncRet[0] && // e.g.,  { 0 : {} }
            Object.keys(targetFuncRet[0]).length === 0 && targetFuncRet[0].constructor === Object;
        const isTarget0Exists =  targetFuncRet[0] && // e.g.,  { 0 : {foo;bar} }
            Object.keys(targetFuncRet[0]).length !== 0 && targetFuncRet[0].constructor === Object;

        if (typeof targetFuncRet === 'string') { // ignore string values bcoz it's from var xxx = foo.bar()
          target[firstKey] = function() { return sourceFuncRet; }
        } else if (isTarget0EmptyObj) {
          delete target[firstKey][0];
          target[firstKey] = function() { return sourceFuncRet; }
        } else if (isTarget0Exists) {
          const ret = Object.assign({}, sourceFuncRet[0], targetFuncRet[0]);
          target[firstKey] = function() { return [ret]; }
          // console.log('###################################', {sourceFuncRet, targetFuncRet})
        } else {
          const mergedFuncRet = Object.assign({}, sourceFuncRet, targetFuncRet);
          target[firstKey] = function() { return mergedFuncRet; }
        }
        
      } else if (typeof sourceFuncRet === 'string') {

        target[firstKey] = function() { return sourceFuncRet; }

      }
    } else if (firstKey && typeof source[firstKey] !== 'function') {
      Util.merge(source[firstKey], target[firstKey]);
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
   * Returns dot(.) separated members as an array from an code expression in reverse order
   *
   * MemberExpression e.g., foo.bar().x -> [x, (), bar, foo]
   * CallExpression   e.g.  foo.x.bar() -> [(), bar, x, foo]
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

    if (object) { // MemberExpression
      const kode = Util.getCode(object, code);
      result = Util.getExprMembers(kode, result);
    } else if (callee) { // CallExpression
      const kode = Util.getCode(callee, code);
      result = Util.getExprMembers(kode, result);
    } else if (node.left) { // BinaryExpression
      const kode = Util.getCode(node.left, code);
      result = Util.getExprMembers(kode, result);
    }
    return result;
  }

  /**
   * return simplified function arguments in string format
   * e.g. from `myFunc(x => [x.y])`
   *     returns, 'x => [x.y]'
   * e.g. from `myFunc(foo, bar, [1,2], a||b, x(), foo.bar, {}, a ? b:c)`
   *     returns, 'foo,bar,[],BIN_EXPR,CALL_EXPR,MBR_EXPR,UNRU_EXPR,COND_EXPR'
   */
  static getFuncArgNames (code) {
    if (typeof code !== 'string') throw new Error('%%%%%%%%%%%%%%%%% getFuncArgNames');

    const node = Util.getNode(code);
    const argNames = node.arguments.map(arg => {
      if (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression') {
        return code.substring(arg.start, arg.end); 
      } else if (arg.params && arg.params[0] && arg.params[0].type === 'ArrayPattern') {
        return `ARR_PTRN`;
      } else if (arg.type === 'ArrayExpression') {
        return `[]`;
      } else if (typeof arg.value !== 'undefined') {
        return arg.raw || arg.value;
      } else if (arg.type === 'Identifier' && arg.name) {
        return arg.name;
      } else if (arg.type === 'BinaryExpression') return 'BIN_EXPR';
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
    if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getObjectFromExpression';

    if (code.match(/yield /)) {
      code = code.replace(/yield /g, '');
    }

    const node = Util.getNode(code);
    const exprMembers = Util.getExprMembers(code);

    let nxt, obj;
    const firstExpr = exprMembers[0];
    const isFirstExprFuncLike = firstExpr && firstExpr.startsWith('(');
    if (isFirstExprFuncLike && firstExpr === '()') {
      obj = function() { return returns; }
    } else if (isFirstExprFuncLike) {
      const node = Util.getNode(firstExpr);
      if (node.type.match(/FunctionExpression$/)) {
        const funcArguments = Util.getFuncArguments(firstExpr);
        obj = function() { return funcArguments; }
      } else {
        obj = function() { return returns; }
      }
    } else {
      obj = returns;
    }

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

  /**
   * return function argument value from a CallExpression code.
   * e.g. `x.y.z(foo => foo.bar.baz)` returns [{bar: {baz: {}} }
   * e.g. `x.y.z()` returns  undefined
   */
  static getFuncReturn (code) {
    if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getFuncReturn';

    try {
      jsParser.parse(code);
    } catch (e) {
      throw new Error(`ERROR this JS code is invalid, "${code}"`);
    }

    const node = Util.getNode(code);
    const funcExprArg = Util.isFunctionExpr(node) && node.arguments[0];
    if (funcExprArg) { // if the first argument is a function
      const funcCode = code.substring(funcExprArg.start, funcExprArg.end);
      const funcArguments = Util.getFuncArguments(funcCode);
      return funcArguments;
    } 
  }

  /**
   * return value-filled function arguments in array format
   * e.g. `foo => foo.bar.baz` returns [{bar: {baz: {}}]
   * e.g. `(foo,bar) => {}` returns [{}, {}]
   * e.g. `([foo,bar]) => {}` returns [[{}, {}]]
   * e.g. `({foo,bar}) => {}` returns [{foo:{}, bar:{}}]
   */
  static getFuncArguments (code) {
    if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getFuncArguments ' + code;

    const paramValues = Util.getFuncParamObj(code); // {param1: value1, param2: value2}
    const node = Util.getNode(code);

    let funcParams = [];
    node.params.forEach( (param, index) => {
      if (param.type === 'ArrayPattern') {
        param.elements.forEach(prop => {
          let ret;
          if (prop.type === 'Identifier') {
            ret = paramValues[prop.name];
          } else if (prop.type === 'ArrayPattern') {
            ret = prop.elements.map(el => paramValues[el.name]);
          } else if (prop.type === 'ObjectPattern') {
            ret = {};
            prop.properties.forEach(prop => { 
              ret[prop.key.name] = paramValues[prop.key.name];
            });
          }
          funcParams.push(ret);
        });
      } else if (param.type === 'ObjectPattern') {
        funcParams[index] = {};
        param.properties.forEach(prop => { 
          funcParams[index][prop.key.name] = paramValues[prop.key.name];
        });
      } else if (param.type === 'Identifier') {
        funcParams[index] = paramValues[param.name];
      }
    });

    return funcParams;
  }

  /**
   *  Returns function param as an object from CallExpression
   *  e.g. 'foo.bar.x(event => { event.x.y.z() }' returns  {x : { y: z: function() {} }}
   */
  static getFuncParamObj (code) { // CallExpression
    if (typeof code !== 'string') throw '%%%%%%%%%%%%%%%%% getFuncParamObj';

    const node = Util.getNode(code);
    if (!node.type.match(/FunctionExpression$/))
      return false;

    const funcRetExprsRaw = Util.getFuncParamCodes(code);
    const funcRetExprsFlat = funcRetExprsRaw.reduce((acc, val) => acc.concat(val), []);
    const funcRetExprs = Array.from(new Set(funcRetExprsFlat));

    const funcParam = {};
    (funcRetExprs || []).forEach(funcExpr => { // e.g., ['event.urlAfterRedirects.substr(1)', ..]
      const matches = funcExpr.match(/([\(\[])(['"]*)[^)]*$/); // 1: [ or ( 2: ' or "
      const endEncloser = matches && (matches[1] === '(' ? ')' : ']');
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

      const newReturn = Util.getFuncReturn(funcExpr);
      const newObj = Util.getObjectFromExpression(funcExpr, newReturn);
      Util.merge(newObj, funcParam);
    });

    return funcParam;
  }

  /**
   * returns function parameter related codes from a function codes
   */
  static getFuncParamCodes (code) {
    const paramCodes = [];

    const paramNames1 = Util.getFuncParamNames(code);

    const paramNames = paramNames1.reduce((acc, val) => acc.concat(val), []);
    // const codeShortened = code.replace(/\n+/g, '').replace(/\s+/g, ' ');

    paramNames.forEach(paramName => {
      const paramNameMatchRE = new RegExp(`[^a-z]${paramName}(\\.[^\\s\\;\\)\\\+\\-\\]\\}\\,]+)+`, 'img')
      const matches = code.match(paramNameMatchRE);
      if (matches) {
        // remove the invalid first character. e.g. '\nmyParam.foo.bar'
        paramCodes.push(matches.map(el => el.slice(1))); 
      }
    });

    return paramCodes;
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

  static getMockFn(keys, returns) { // e.g. x, y, z, {a:1, b:2}
    if (Util.FRAMEWORK === 'karma') {
      const lastVarName = keys.slice(-1);
      const baseVarName = keys.slice(0, -1).join('.')
      const mockFnJS = `spyOn(${baseVarName}, '${lastVarName}')`;
      const mockReturnJS = returns ? `.and.returnValue(${returns})` : '';
      return mockFnJS + mockReturnJS;
    } else {
      const mockFnJS = `${keys.join('.')} = jest.fn()`;
      const mockReturnJS = returns ? `.mockReturnValue(${returns})` : '';
      return mockFnJS + mockReturnJS;
    }
  }

  static getFuncMockJS (mockData, thisName = 'component') {
    const js = [];
    const asserts = [];

    Object.entries(mockData.props).forEach(([key1, value]) => {

      if (typeof value === 'function') {
        const funcRetVal = value();
        if (typeof funcRetVal === 'string' || Object.keys(funcRetVal).length === 0) { // e.g.{}, or  myVar from `const myVar = this.foo.var();`
          js.push(Util.getMockFn([thisName, key1], null));
        } else {
          js.push(Util.getMockFn([thisName, key1], Util.objToJS(funcRetVal)));
        }
        asserts.push([thisName, key1]);
      } else {
        const valueFiltered = Object.entries(value).filter(([k, v]) => k !== 'undefined');
        valueFiltered.forEach(([key2, value2]) => {

          js.push(`${thisName}.${key1} = ${thisName}.${key1} || {}`);
          if (typeof value2 === 'function' && key2.match(/^(post|put)$/)) {
            js.push(Util.getMockFn([thisName, key1, key2], `observableOf('${key2}')`));
            asserts.push([thisName, key1, key2]);
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
            const funcRet1stKey = Util.getFirstKey(funcRetVal);
            if (typeof funcRetVal === 'object' && ['toPromise'].includes(funcRet1stKey)) {
              const retStr = Util.objToJS(funcRetVal[funcRet1stKey]());
              js.push(Util.getMockFn([thisName, key1, key2], `observableOf(${retStr})`));
            } else if (typeof funcRetVal === 'object' && ['filter'].includes(funcRet1stKey)) {
              const retStr = Util.objToJS(funcRetVal[funcRet1stKey]());
              js.push(Util.getMockFn([thisName, key1, key2], `[${retStr}]`));
            } else if (typeof funcRetVal === 'object' && funcRet1stKey) {
              js.push(Util.getMockFn([thisName, key1, key2], `${Util.objToJS(funcRetVal)}`));
            } else {
              js.push(Util.getMockFn([thisName, key1, key2]));
            }
            asserts.push([thisName, key1, key2]);
            // const funcRetValEmpty = Object.as`funcRetVal
          } else if (['length'].includes(key2)) {
            // do nothing
          } else if (typeof value2 === 'function') {
            const funcRetVal = value2();
            if (typeof funcRetVal === 'string' || Object.keys(funcRetVal).length === 0) { // e.g. myVar from `const myVar = this.foo.var();`
              js.push(Util.getMockFn([thisName, key1, key2]));
            } else {
              js.push(Util.getMockFn([thisName, key1, key2], `${Util.objToJS(funcRetVal)}`));
            }
            asserts.push([thisName, key1, key2]);
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
          js.push(Util.getMockFn([key1, key2]));
          asserts.push([key1, key2]);
        } else {
          Object.entries(value2).forEach(([key3, value3]) => { // location
            if (typeof value3 === 'function') {
              js.push(Util.getMockFn([key1, key2, key3]));
              asserts.push([key1, key2, key3]);
            } else if (value3) {
              const objValue3 = Util.objToJS(value3).replace(/\{\s+\}/gm, '{}');
              js.push(`${key1}.${key2}.${key3} = ${objValue3}`);
            }
          });
        }
      });
    });

    return [js, asserts];
  }

  /**
   * Return JS expression of parameter
   */
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

  /**
   * Get first key of an object
   */
  static getFirstKey(obj) {
    const firstKey = typeof obj === 'object' && Object.keys(obj).filter(k => k !== 'undefined')[0];
    return firstKey || undefined;
  }
}

module.exports = Util;
