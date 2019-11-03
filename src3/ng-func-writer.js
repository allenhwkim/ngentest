const jsParser = require('acorn').Parser;
const Util = require('./util.js');

class NgFuncWriter {

  get parameters () {
    const params = {};
    this.methodDefinition.value.params.forEach(el => (params[el.name] = {}));
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
    this.methodDefinition = this.klassDecl.body.body.find(node => node.key.name === this.funcName);
  }

  /**
   * Iterate function expressions one by one
   *  then, sets the given props, params, maps from the expressinns
   */
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
    const code = this.classCode.substring(node.start, node.end);

    if (expr.type === 'LogicalExpression') {
      // console.log(' case1 >>>>>>>>>>>>>>>>>>>', code);
      this.setPropsOrParams(expr.left, { props, params, map });

    } else if (expr.type === 'MemberExpression') {
      // console.log(' case2 >>>>>>>>>>>>>>>>>>>');
      this.setPropsOrParams(expr, { props, params, map });

    } else if (expr.type === 'BlockStatement') {
      console.log('TODO', 'make use of __getThisExprs, then set props');
      console.log('TODO', 'make use of __getParamExprs, then set params');

    } else if (expr.type === 'CallExpression') {
      // e.g. this.router.events.subscribe(event => xxxxxxx)
      // e.g. this.foo.bar.x(1,2,3);
      const funcReturn = Util.getExprReturn(expr, this.classCode) || {};
      // {code: 'this.router.events', type: 'Observable', value: Observable.of(event)}
      this.setPropsOrParams(funcReturn.code, { props, params, map }, funcReturn.value);

      console.log('TODO', 'make use of __getThisExprs, then set props');
      console.log('TODO', 'make use of __getParamExprs, then set params');

    } else if (expr.type === 'AssignmentExpression') {
      const rightObj = expr.right.type === 'LogicalExpression' ? expr.right.left : expr.right;
      const leftCode = this.classCode.substring(expr.left.start, expr.left.end);
      const rightCode = this.classCode.substring(rightObj.start, rightObj.end);

      const [left1, left2, left3] = leftCode.split('.'); // this.prop
      const [right1, right2] = rightCode.split('.'); // param

      const right = Util.getObjectFromExpression(rightObj);
      if (left1 === 'this' && left2 && !left3 && params[right1] && !right2) {
        // set map between params to `this value`. e.g. this.foo = param1
        map[`this.${left2}`] = right1;
      } else if (left1 === 'this' && right1 === 'this' && map[`this.${right2}`]) {
        // set param value instead of 'this'(prop) value e.g., this.bar = this.foo.x.y (`this.foo` is from param1)
        Util.assign(right.this, params); // (source, target)
      } else {
        this.setPropsOrParams(expr.left, { props, params, map });
        this.setPropsOrParams(expr.right, { props, params, map });
      }
    } else {
      console.log('WARNING WARNING WARNING unprocessed expression', expr.type, code);
    }
  }

  /**
   * Process single expression and sets 'this' or params refrencing props to param map
   */
  setPropsOrParams (codeOrNode, { props, params, map }, returns) { // MemberExpression, CallExpression
    // console.log('.......... codeOrNode...', codeOrNode);
    let nodeToUse, obj, one, two;
    if (typeof codeOrNode === 'string') {
      nodeToUse = Util.getNode(codeOrNode);
      obj = Util.getObjectFromExpression(nodeToUse, returns);
      [one, two] = codeOrNode.split('.'); // this.prop
    } else {
      nodeToUse = codeOrNode.type === 'LogicalExpression' ? codeOrNode.left : codeOrNode;
      obj = Util.getObjectFromExpression(nodeToUse, returns);
      const code = this.classCode.substring(codeOrNode.start, codeOrNode.end);
      [one, two] = code.split('.'); // this.prop
    }
    // console.log('  ....... {one, two}', { one, two });

    if (one === 'this' && two && map[`this.${two}`]) {
      Util.assign(obj.this, params);
    } else if (one === 'this' && two) {
      Util.assign(obj.this, props);
    } else if (params[one] && two) {
      Util.assign(obj, params);
    }
  }

}

module.exports = NgFuncWriter;
