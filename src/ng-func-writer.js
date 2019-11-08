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

  getCode (node) {
    return this.classCode.substring(node.start, node.end);
  }
  /**
   * Iterate function expressions one by one
   *  then, sets the given props, params, maps from the expressinns
   */
  setMockData (nodeIn, mockData) { // node: ExpressionStatement
    const node = /* eslint-disable */
      nodeIn.type === 'ExpressionStatement' ? nodeIn.expression :
      nodeIn.type === 'DeclaratoinxapressionStatement' ? nodeIn.declarations :
      nodeIn.type === 'IfStatement' ? nodeIn.consequent : // node.test (consequent)
      nodeIn.type === 'VariableDeclaration' ? nodeIn.declarations[0].init : // node.id (init)
      nodeIn.type === 'ArrowFunctionExpression' ? nodeIn.body :
      nodeIn.type === 'FunctionExpression' ? nodeIn.body :
      nodeIn.type === 'ReturnStatement' ? nodeIn.argument :
      null; /* eslint-enable */

    if (!node) {
      console.error('\x1b[31m%s\x1b[0m', nodeIn);
      throw new Error('ERROR: Invalid node type ' + nodeIn.type);
    }
    const code = this.getCode(node);

    if (node.type === 'Literal') {
      Util.DEBUG && console.log('    *** EXPRESSION Literal ***', node);
    } else if (node.type === 'LogicalExpression') {
      Util.DEBUG && console.log('    *** EXPRESSION LogicalExpression ***', this.getCode(node));
      this.setPropsOrParams(node.left, mockData);

    } else if (node.type === 'MemberExpression') { // this.xxxx, foo.xxxx
      Util.DEBUG && console.log('    *** EXPRESSION MemberExpression ***', this.getCode(node));
      this.setPropsOrParams(node, mockData);

    } else if (node.type === 'BlockStatement') {
      node.body.forEach(expr => {
        Util.DEBUG && console.log('    *** EXPRESSION BlockStatement ***', this.getCode(expr));
        this.setMockData(expr, mockData);
      });

    } else if (node.type === 'CallExpression') {
      // e.g. this.router.events.subscribe(event => xxxxxxx)
      // e.g. this.foo.bar.x(1,2,3);
      const funcReturn = Util.getExprReturn(node, this.classCode) || {};
      // {code: 'this.router.events', type: 'Observable', value: Observable.of(event)}
      Util.DEBUG && console.log('    *** EXPRESSION CallExpression ***', funcReturn.code);
      this.setPropsOrParams(funcReturn.code, mockData, funcReturn.value);

      const funcExpArg = Util.getFuncExprArg(node);
      if (funcExpArg) {
        this.setMockData(funcExpArg, mockData);
      }
    } else if (node.type === 'AssignmentExpression') {
      Util.DEBUG && console.log('    *** EXPRESSION AssignmentExpression ***', this.getCode(node));
      const rightObj = node.right.type === 'LogicalExpression' ? node.right.left : node.right;
      const leftCode = this.getCode(node.left);
      const rightCode = this.getCode(rightObj);

      const [left1, left2, left3] = leftCode.split('.'); // this.prop
      const [right1, right2] = rightCode.split('.'); // param
      const { params, map } = mockData;

      const right = Util.getObjectFromExpression(rightObj);
      if (left1 === 'this' && left2 && !left3 && params[right1] && !right2) {
        // set map between params to `this value`. e.g. this.foo = param1
        map[`this.${left2}`] = right1;
      } else if (left1 === 'this' && right1 === 'this' && map[`this.${right2}`]) {
        // set param value instead of 'this'(prop) value e.g., this.bar = this.foo.x.y (`this.foo` is from param1)
        Util.assign(right.this, params); // (source, target)
      } else {
        this.setPropsOrParams(node.left, mockData);
        this.setPropsOrParams(node.right, mockData);
      }
    } else {
      console.warn('\x1b[33m%s\x1b[0m', `WARNING WARNING WARNING unprocessed expression ${node.type} ${code}`);
    }
  }

  /**
   * Process single expression and sets 'this' or params refrencing props to param map
   */
  setPropsOrParams (codeOrNode, mockData, returns) { // MemberExpression, CallExpression
    const { props, params, map, globals } = mockData;
    // console.log('.......... codeOrNode...', codeOrNode);
    let nodeToUse, obj, one, two;
    if (typeof codeOrNode === 'string') {
      nodeToUse = Util.getNode(codeOrNode);
      obj = Util.getObjectFromExpression(nodeToUse, returns);
      [one, two] = codeOrNode.split('.'); // this.prop
    } else {
      nodeToUse = codeOrNode.type === 'LogicalExpression' ? codeOrNode.left : codeOrNode;
      obj = Util.getObjectFromExpression(nodeToUse, returns);
      const code = this.getCode(codeOrNode);
      [one, two] = code.split('.'); // this.prop
    }
    // console.log('  ....... {one, two}', { one, two });

    if (one === 'this' && two && map[`this.${two}`]) {
      Util.assign(obj.this, params);
    } else if (one === 'this' && two) {
      Util.assign(obj.this, props);
    } else if (params[one] && two) {
      Util.assign(obj, params);
    } else if (one === 'window' || obj === 'document') {
      Util.assign(obj, globals);
    }
  }

}

module.exports = NgFuncWriter;
