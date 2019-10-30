const jsParser = require('acorn').Parser;

class NgFuncWriter {
  // instanceProps = {} // instance variable name and values. e.g. this.foo.bar;
  // funcParams = {}    // function parameter variable name and value e.g. param1, param2

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

    this.instanceProps = {};
    this.funcParams = Object.assign({}, this.parameters);
    this.propParamMap = {};
  }

  setMockData (node, { props, params, map }) { // node: ExpressionStatement
    const expr = node.expression;
    const code = this.__getCode(expr);
    console.log('processing....', expr.type, code);

    if (expr.type === 'LogicalExpression') {
      // console.log(' case1 >>>>>>>>>>>>>>>>>>>', code);
      this.__setPropsAndParams(expr.left, { props, params, map });
    } else if (expr.type === 'MemberExpression') {
      // console.log(' case2 >>>>>>>>>>>>>>>>>>>');
      this.__setPropsAndParams(expr, { props, params, map });
    } else if (expr.type === 'AssignmentExpression', code) {
      const rightObj = expr.right.type === 'LogicalExpression' ? expr.right.left : expr.right;

      const [left1, left2, left3] = this.__getCode(expr.left).split('.'); // this.prop
      const [right1, right2, _] = this.__getCode(rightObj).split('.'); // param

      const left = this.__getObjectFromExpression(expr.left);
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
        this.__setPropsAndParams(expr.left, {props, params, map});
        this.__setPropsAndParams(expr.right, {props, params, map});
      }
    } else {
      console.log('WARNING unprocessed expression', code);
    }
    return { props, params, map };
  }

  __getCode (node) {
    return this.classCode.substring(node.start, node.end);
  }

  /**
   * Process single expression and sets 'this' or params
   */
  __setPropsAndParams (node, {props, params, map}) { // MemberExpression, CallExpression
    const nodeToUse = node.type === 'LogicalExpression' ? node.left: node;
    const obj = this.__getObjectFromExpression(nodeToUse);
    const [one, two] = this.__getCode(node).split('.'); // this.prop
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
  __getObjectFromExpression(node) {
    const exprMembers = this.__getMembersFromExpression(node);

    let nxt, obj;
    obj = exprMembers[0] === '()' ? function () { return {}; } : {};
    exprMembers.forEach((str, ndx) => {
      nxt = exprMembers[ndx + 1];
      if (nxt === '()') {
        const fnRet = { [str]: obj };
        obj = function () { return fnRet; };
      } else if (str !== '()') {
        obj = { [str]: obj };
      }
    });

    return obj;
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
        type === 'CallExpression' ? '()' :
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
