const jsParser = require('acorn').Parser;
const observableOf = require('rxjs').of;

class Util {
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
    if (typeof source[firstKey] !== 'function') {
      Util.assign(source[firstKey], target[firstKey]);
    }
    return true;
  }

  static getNode (code) {
    const parsed = jsParser.parse(code);
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
  static getExprMembers (node, result = []) {
    const { type, property, object, callee } = node;
    const member =
      type === 'MemberExpression' ? property.name :
        type === 'CallExpression' ? `(${Util.getFuncArgNames(node)})` :
          type === 'ThisExpression' ? 'this' :
            type === 'Identifier' ? node.name : undefined;
    result.push(member);

    if (object) {
      result = Util.getExprMembers(object, result);
    } else if (callee) {
      result = Util.getExprMembers(callee, result);
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
  static getFuncArgNames (node) {
    const argNames = node.arguments.map(arg => {
      // console.log('......... arg ...........', arg);
      if (arg.params) {
        return arg.params[0].name;
      } else if (arg.type === 'ArrayExpression') {
        return `[]`;
      } else if (typeof arg.value !== 'undefined') {
        return arg.value;
      }
    });
    return argNames.join(',');
  }

  static getFuncExprArg (node) {
    return node.arguments &&
      node.arguments[0] &&
      node.arguments[0].type.match(/FunctionExpression/) &&
      node.arguments[0];
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
  static getObjectFromExpression (node, returns = {}) {
    const exprMembers = Util.getExprMembers(node);

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

  /**
   * if ends with something, return certain type.
   * e.g. for `foo.bar.substr(1)` , 'foo.bar' returns string
   * e.g. for 'foo.bar.subscribe(...)', 'foo.bar' returns Observable
   * e.g. for 'foo.bar.forEach(...)', 'foo.bar' returns array
   */
  static getExprReturn (node, classCode) {
    const code = classCode.substring(node.start, node.end);

    const members = Util.getExprMembers(node).reverse();
    const vars = members.join('.').replace(/\.\(/g, '(').split('.');
    const baseCode = vars.slice(0, -1).join('.');
    const last = vars[vars.length - 1];

    let ret;
    const funcExprArg = Util.getFuncExprArg(node);
    if (last.match(/(substr|replace)\(.*\)$/)) {
      ret = { code: baseCode, type: 'string', value: 'gentest' };
    } else if (last.match(/(subscribe)\(.*\)$/) && funcExprArg) {
      const funcCode = classCode.substring(funcExprArg.body.start, funcExprArg.body.end);
      const funcParam = Util.getFuncParamObj(funcExprArg, funcCode);
      ret = { code: baseCode, type: 'Observable', value: observableOf(funcParam || {}) };
    } else if (last.match(/(map|forEach)\(.*\)$/) && funcExprArg) {
      const funcCode = classCode.substring(funcExprArg.body.start, funcExprArg.body.end);
      const funcParam = Util.getFuncParamObj(funcExprArg, funcCode);
      ret = { code: baseCode, type: 'string', value: [funcParam] };
    } else {
      ret = { code: code, type: 'unknown', value: {} };
    }

    return ret;
  }

  /**
   *  Returns function param as an object from CallExpression
   *  e.g. 'foo.bar.x(event => { event.x.y.z() }' returns
   *    {x : { y: z: function() {} }}
   */
  static getFuncParamObj (node, code) { // CallExpression
    const funcRetName = node.params[0].name;
    const codeReplaced = code.replace(/\n+/g, '').replace(/\s+/g, ' ');
    const funcRetExprs = codeReplaced.match(new RegExp(`${funcRetName}(\\.[^\\s\\\;]+)+`, 'ig'));

    const funcParam = {};
    funcRetExprs.forEach(funcExpr => { // e.g., ['event.urlAfterRedirects.substr(1)', ..]
      const exprNode = Util.getNode(funcExpr);
      const newReturn = Util.getExprReturn(exprNode, funcExpr);
      const newCode = newReturn.code;
      const newValue = newReturn.value;
      const newNode = Util.getNode(newCode);
      const newObj = Util.getObjectFromExpression(newNode, newValue);
      const source = newObj[Object.keys(newObj)[0]];
      Util.assign(source, funcParam);
    });

    return funcParam;
  }

  /**
   * returns array of `this......` related codes from the node
   */
  static getThisExprs (node, allCode) {
    const code = allCode.substring(node.start, node.end);
    const code2 = code.replace(/\n+/g, '').replace(/\s+/g, ' ');
    const thisExprs = code2.match(new RegExp(`this(\\.[^\\s\\\;]+)+`, 'ig'));
    return thisExprs;
  }

  /**
   * returns function parameter related codes from the node
   */
  static getParamExprs (node, paramNames, allCode) {
    const code = allCode.substring(node.start, node.end);
    const code2 = code.replace(/\n+/g, '').replace(/\s+/g, ' ');
    const paramExprs = [];
    paramNames.forEach(paramName => {
      const matches = code2.match(new RegExp(`${paramName}(\\.[^\\s\\;]+)+`, 'ig'));
      paramExprs.push(matches);
    });

    return paramExprs.flat();
  }

}

module.exports = Util;
