const jsParser = require('acorn').Parser;
const observableOf = require('rxjs').of;

class NgFuncWriter {

  get methodDefinition () {
    const methodDefinitions = this.klassDecl.body.body;
    return methodDefinitions.find(node => node.key.name === this.funcName);
  }

  get javascript () {
    const { start, end } = this.methodDefinition; // type, start, end, kind
    return this.classCode.substring(start, end);
  }

  get parameters () {
    const params = {};
    this.methodDefinition.value.params.forEach(el => {
      params[el.name] = {};
    });
    return params;
  }

  get expressions () {
    const block = this.methodDefinition.value.body;
    return block.body; // array of ExpressionStatements
  }

  constructor (Klass, funcName) {
    this.Klass = Klass;
    this.funcName = funcName;
    this.classCode = '' + Klass.prototype.constructor;
    this.klassDecl = jsParser.parse(this.classCode).body[0];
  }

  /**
   * if ends with something, return certain type.
   * e.g. for `foo.bar.substr(1)` , 'foo.bar' returns string
   * e.g. for 'foo.bar.subscribe(...)', 'foo.bar' returns Observable
   * e.g. for 'foo.bar.forEach(...)', 'foo.bar' returns array
   */
  __getReturn (codeNode) {
    // console.log(' __getReturn 1', codeNode);
    let code, node;
    if (typeof codeNode === 'string') {
      code = codeNode;
      node = this.__getNode(codeNode);
    } else {
      code = this.__getCode(codeNode);
      node = codeNode;
    }
    // console.log(' XXXXXXXXXXXXXXXXXX   __getReturn 2', {code, node});

    const members = this.__getMembersFromExpression(node).reverse();
    const vars = members.join('.').replace(/\.\(/g, '(').split('.');
    const baseCode = vars.slice(0, -1).join('.');
    const last = vars[vars.length - 1];
    // console.log(' XXXXXXXXXXXXXXXXXX   __getReturn 3', {vars, baseCode, last}, node.type);

    const funcParam = node.type === 'CallExpression' ? this.__getFuncParam(node) : null;

    let ret;
    if (last.match(/(substr|replace)\(.*\)$/)) {
      ret = { code: baseCode, type: 'string', value: 'gentest' };
    } else if (last.match(/(subscribe)\(.*\)$/)) {
      ret = { code: baseCode, type: 'Observable', value: observableOf(funcParam || {}) };
    } else if (last.match(/(map|forEach)\(.*\)$/)) {
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
  __getFuncParam (node) { // CallExpression
    const firstArg = node.arguments[0];
    if (!firstArg || !firstArg.type.match(/FunctionExpression/)) { // ArrowFunctionExpression, FunctionExpression
      return false;
    }

    const funcRetName = firstArg.params[0].name;
    const code = this.__getCode(firstArg.body).replace(/\n+/g, '').replace(/\s+/g, ' ');
    const funcRetExprs = code.match(new RegExp(`${funcRetName}(\\.[^\\s\\\;]+)+`, 'ig'));

    const funcParam = {};
    funcRetExprs.forEach(funcExpr => { // e.g., event.urlAfterRedirects.substr(1)
      const newReturn = this.__getReturn(funcExpr);
      const newCode = newReturn.code;
      const newValue = newReturn.value;
      const newNode = this.__getNode(newCode);
      const newObj = this.__getObjectFromExpression(newNode, newValue);
      const source = newObj[Object.keys(newObj)[0]];
      this.__assign(source, funcParam);
    });

    return funcParam;
  }

  __getThisExprs (node) {
    const code = this.__getCode(node).replace(/\n+/g, '').replace(/\s+/g, ' ');
    const thisExprs = code.match(new RegExp(`this(\\.[^\\s\\\;]+)+`, 'ig'));
    return thisExprs;
  }

  __getParamExprs (node, paramNames) {
    const code = this.__getCode(node).replace(/\n+/g, '').replace(/\s+/g, ' ');
    const paramExprs = [];
    paramNames.forEach(paramName => {
      const matches = code.match(new RegExp(`${paramName}(\\.[^\\s\\;]+)+`, 'ig'));
      paramExprs.push(matches);
    });

    return paramExprs.flat();
  }

  setMockData (node, { props, params, map }) { // node: ExpressionStatement
    const expr =
      node.type === 'ExpressionStatement' ? node.expression :
        node.type === 'DeclaratoinxapressionStatement' ? node.declarations :
          node.type === 'IfStatement' ? node.consequent : // node.test (consequent)
            node.type === 'VariableDeclaration' ? node.declarations[0].init : // node.id (init)
              null;
    if (!expr) {
      console.error(node);
      throw new Error('ERROR: Invalid node type ' + node.type);
    }
    const code = this.__getCode(node);

    if (expr.type === 'LogicalExpression') {
      // console.log(' case1 >>>>>>>>>>>>>>>>>>>', code);
      this.__setPropsOrParams(expr.left, { props, params, map });

    } else if (expr.type === 'MemberExpression') {
      // console.log(' case2 >>>>>>>>>>>>>>>>>>>');
      this.__setPropsOrParams(expr, { props, params, map });

    } else if (expr.type === 'BlockStatement') {
      console.log('TODO', 'make use of __getThisExprs, then set props');
      console.log('TODO', 'make use of __getParamExprs, then set params');

    } else if (expr.type === 'CallExpression') {
      // e.g. this.router.events.subscribe(event => xxxxxxx)
      // e.g. this.foo.bar.x(1,2,3);
      const funcReturn = this.__getReturn(expr) || {};
      // {code: 'this.router.events', type: 'Observable', value: Observable.of(event)}
      this.__setPropsOrParams(funcReturn.code, { props, params, map }, funcReturn.value);

      console.log('TODO', 'make use of __getThisExprs, then set props');
      console.log('TODO', 'make use of __getParamExprs, then set params');

    } else if (expr.type === 'AssignmentExpression') {
      const rightObj = expr.right.type === 'LogicalExpression' ? expr.right.left : expr.right;

      const [left1, left2, left3] = this.__getCode(expr.left).split('.'); // this.prop
      const [right1, right2] = this.__getCode(rightObj).split('.'); // param

      // const left = this.__getObjectFromExpression(expr.left);
      const right = this.__getObjectFromExpression(rightObj);
      if (left1 === 'this' && left2 && !left3 && params[right1] && !right2) {
        // set map between params to `this value`. e.g. this.foo = param1
        // console.log(' case3 >>>>>>>>>>>>>>>>>>>');
        map[`this.${left2}`] = right1;
      } else if (left1 === 'this' && right1 === 'this' && map[`this.${right2}`]) {
        // set param value instead of 'this'(prop) value e.g., this.bar = this.foo.x.y (`this.foo` is from param1)
        // console.log(' case4 >>>>>>>>>>>>>>>>>>>', right.this, props);
        this.__assign(right.this, params); // (source, target)
      } else {
        // console.log(' case5 >>>>>>>>>>>>>>>>>>>', left, right);
        this.__setPropsOrParams(expr.left, { props, params, map });
        this.__setPropsOrParams(expr.right, { props, params, map });
      }
    } else {
      console.log('WARNING WARNING WARNING unprocessed expression', expr.type, code);
    }
    return { props, params, map };
  }

  __getNode (code) {
    const parsed = jsParser.parse(code);
    const firstNode = parsed.body[0];
    const node = firstNode.type === 'BlockStatement' ? firstNode.body[0] :
      firstNode.type === 'ExpressionStatement' ? firstNode.expression : null;
    return node;
  }

  __getCode (node, allCode) {
    allCode = allCode || this.classCode;
    return this.classCode.substring(node.start, node.end);
  }

  /**
   * Process single expression and sets 'this' or params
   */
  __setPropsOrParams (codeOrNode, { props, params, map }, returns) { // MemberExpression, CallExpression
    // console.log('.......... codeOrNode...', codeOrNode);
    let nodeToUse, obj, one, two;
    if (typeof codeOrNode === 'string') {
      nodeToUse = this.__getNode(codeOrNode);
      obj = this.__getObjectFromExpression(nodeToUse, returns);
      [one, two] = codeOrNode.split('.'); // this.prop
    } else {
      nodeToUse = codeOrNode.type === 'LogicalExpression' ? codeOrNode.left : codeOrNode;
      obj = this.__getObjectFromExpression(nodeToUse, returns);
      [one, two] = this.__getCode(codeOrNode).split('.'); // this.prop
    }
    // console.log('  ....... {one, two}', { one, two });

    if (one === 'this' && two && map[`this.${two}`]) {
      this.__assign(obj.this, params);
    } else if (one === 'this' && two) {
      this.__assign(obj.this, props);
    } else if (params[one] && two) {
      this.__assign(obj, params);
    }
  }

  /**
   * set value from source ONLY IF target value does not exists
   *
   * For example, assuming source is {foo: {bar: 1}}, and target is {foo: {baz: 2}}
   * AFter this function, target wil become { foo: {bar: 1, baz: 2}}
   */
  __assign (source, target) {
    // console.log('............. __assign', {source, target});
    const firstKey = Object.keys(source)[0];
    if (!target[firstKey]) {
      target[firstKey] = source[firstKey];
      return;
    }
    if (typeof source[firstKey] !== 'function') {
      this.__assign(source[firstKey], target[firstKey]);
    }
    return true;
  }

  /**
   * Build a Javascript object from expression by parsing expression members
   *
   * MemberExpression     e.g., foo.bar.x().y
   * Identifier           e.g., foo
   * LogicalExpresssion   e.g., foo.bar || a.b
   */
  __getObjectFromExpression (node, returns = {}) {
    const exprMembers = this.__getMembersFromExpression(node);

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

  __getFuncArgNames (node) {
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

  /**
   * Returns expression members in array
   *
   * MemberExpression e.g., foo.bar().x -> [foo, bar, (), x]
   * CallExpression   e.g.  foo.x.bar() -> [foo, x, bar, ()]
   * ThisExpression   e.g.  this -> [this]
   * Identifier       e.g.  foo -> [foo]
   */
  __getMembersFromExpression (node, result = []) {
    const { type, property, object, callee } = node;
    const member =
      type === 'MemberExpression' ? property.name :
        type === 'CallExpression' ? `(${this.__getFuncArgNames(node)})` :
          type === 'ThisExpression' ? 'this' :
            type === 'Identifier' ? node.name : undefined;
    result.push(member);

    if (object) {
      result = this.__getMembersFromExpression(object, result);
    } else if (callee) {
      result = this.__getMembersFromExpression(callee, result);
    }
    return result;
  }

}

module.exports = NgFuncWriter;
