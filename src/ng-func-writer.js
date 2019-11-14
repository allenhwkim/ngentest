const jsParser = require('acorn').Parser;
const Util = require('./util.js');

class NgFuncWriter {

  get parameters () {
    const params = {};
    if (this.methodDefinition) {
      this.methodDefinition.value.params.forEach(el => (params[el.name] = {}));
    }
    return params;
  }

  get expressions () {
    if (this.methodDefinition) {
      const block = this.methodDefinition.value.body;
      return block.body; // array of ExpressionStatements
    }
    return [];
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
    if (!nodeIn || !mockData) {
      console.error({ nodeIn, mockData });
      console.error('\x1b[31m%s\x1b[0m', 'Error: parameter nodeIn or mockData is invalid');
      throw new Error('ERROR: parameter is invalid');
    }
    const node = /* eslint-disable */
      nodeIn.type === 'ArrayExpression' ? nodeIn :
      nodeIn.type === 'ArrayPattern' ? nodeIn :
      nodeIn.type === 'ArrowFunctionExpression' ? nodeIn.body :
      nodeIn.type === 'AssignmentExpression' ? nodeIn :
      nodeIn.type === 'BinaryExpression' ? nodeIn :
      nodeIn.type === 'BlockStatement' ? nodeIn :
      nodeIn.type === 'BreakStatement' ? nodeIn :
      nodeIn.type === 'CallExpression' ? nodeIn :
      nodeIn.type === 'ConditionalExpression' ? nodeIn :
      nodeIn.type === 'DeclaratoinxapressionStatement' ? nodeIn.declarations :
      nodeIn.type === 'ExpressionStatement' ? nodeIn.expression :
      nodeIn.type === 'ForStatement' ? nodeIn.body : // NOTE: init/test/update/body
      nodeIn.type === 'ForInStatement' ? nodeIn :
      nodeIn.type === 'FunctionExpression' ? nodeIn.body :
      nodeIn.type === 'Identifier' ? nodeIn :
      nodeIn.type === 'IfStatement' ? nodeIn.consequent : // node.test (consequent)
      nodeIn.type === 'Literal' ? nodeIn :
      nodeIn.type === 'LogicalExpression' ? nodeIn :
      nodeIn.type === 'MemberExpression' ? nodeIn :
      nodeIn.type === 'NewExpression' ? nodeIn :
      nodeIn.type === 'ObjectExpression' ? nodeIn :
      nodeIn.type === 'ReturnStatement' ? nodeIn.argument :
      nodeIn.type === 'SpreadElement' ? nodeIn.argument :
      nodeIn.type === 'SwitchStatement' ? nodeIn :
      nodeIn.type === 'TemplateLiteral' ? nodeIn :
      nodeIn.type === 'ThrowStatement' ? nodeIn :
      nodeIn.type === 'ThisExpression' ? nodeIn :
      nodeIn.type === 'UnaryExpression' ? nodeIn.argument :
      nodeIn.type === 'VariableDeclaration' ? nodeIn :
      nodeIn.type === 'WhileStatement' ? nodeIn :
      null; /* eslint-enable */

    if (!node) {
      console.error(nodeIn, this.getCode(nodeIn));
      throw new Error('ERROR: Invalid node type ' + nodeIn.type);
    }
    const code = this.getCode(node);

    if ([
      'BreakStatement',
      'Identifier',
      'Literal',
      'NewExpression',
      'ThisExpression',
      'ThrowStatement'
    ].includes(node.type)) {
      // ignore these expressions/statements
      Util.DEBUG && console.log('    *** EXPRESSION ' + node.type + ' ***', this.getCode(node));
    } else if (node.type === 'ArrayExpression') {
      Util.DEBUG && console.log('    *** EXPRESSION ArrayExpression ***', this.getCode(node));
      node.elements.forEach(element => element && this.setMockData(element, mockData));
    } else if (node.type === 'ArrayPattern') {
      Util.DEBUG && console.log('    *** EXPRESSION ArrayPattern ***', this.getCode(node));
      node.elements.forEach(element => element && this.setMockData(element, mockData));
    } else if (node.type === 'TemplateLiteral') {
      Util.DEBUG && console.log('    *** EXPRESSION TemplateLiteral ***', this.getCode(node));
      node.expressions.forEach(expr => expr && this.setMockData(expr, mockData));
    } else if (node.type === 'VariableDeclaration') {
      Util.DEBUG && console.log('    *** EXPRESSION VariableDeclaration ***', this.getCode(node));
      node.declarations.forEach(decl => decl.init && this.setMockData(decl.init, mockData));
    } else if (node.type === 'SwitchStatement') {
      this.setMockData(node.discriminant, mockData);
      node.cases.forEach(kase => {
        kase.test && this.setMockData(kase.test, mockData);
        kase.consequent.forEach(stmt => stmt && this.setMockData(stmt, mockData));
      });
    } else if (node.type === 'ConditionalExpression') {
      Util.DEBUG && console.log('    *** EXPRESSION ConditionalExpression ***', this.getCode(node));
      this.setMockData(node.test, mockData);
      this.setMockData(node.consequent, mockData);
      this.setMockData(node.alternate, mockData);
    } else if (node.type === 'ForInStatement') {
      Util.DEBUG && console.log('    *** EXPRESSION ForInStatement ***', this.getCode(node));
      this.setMockData(node.left, mockData);
      this.setMockData(node.body, mockData);
    } else if (node.type === 'LogicalExpression') {
      Util.DEBUG && console.log('    *** EXPRESSION LogicalExpression ***', this.getCode(node));
      this.setMockData(node.left, mockData);
      this.setMockData(node.right, mockData);
    } else if (node.type === 'BlockStatement') {
      node.body.forEach(expr => {
        Util.DEBUG && console.log('    *** EXPRESSION BlockStatement ***', this.getCode(expr));
        this.setMockData(expr, mockData);
      });
    } else if (node.type === 'BinaryExpression') {
      this.setMockData(node.right, mockData);
      this.setMockData(node.left, mockData);
    } else if (node.type === 'ObjectExpression') {
      node.properties.forEach(property => {
        this.setMockData(property.value, mockData);
      });
    } else if (node.type === 'MemberExpression') { // this.xxxx, foo.xxxx
      Util.DEBUG && console.log('    *** EXPRESSION MemberExpression ***', this.getCode(node));
      this.setPropsOrParams(node, mockData);
    } else if (node.type === 'WhileExpression') { // this.xxxx, foo.xxxx
      Util.DEBUG && console.log('    *** EXPRESSION WhileExpression ***', this.getCode(node));
      this.setPropsOrParams(node.test, mockData);
      this.setPropsOrParams(node.body, mockData);
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
        this.setMockData(node.right, mockData);
        this.setMockData(node.left, mockData);
      }
    } else {
      console.warn({ node });
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
      nodeToUse = /* eslint-disable */
        codeOrNode.type === 'LogicalExpression' ? codeOrNode.left :
        codeOrNode.type === 'BinaryExpression' ? codeOrNode.left :
        codeOrNode; /* eslint-enable */
      obj = Util.getObjectFromExpression(nodeToUse, returns);
      const code = this.getCode(codeOrNode);
      [one, two] = code.split('.'); // this.prop
      Util.DEBUG && console.log('  setPropsOrParams',  {code, type: codeOrNode.type});
    }

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
