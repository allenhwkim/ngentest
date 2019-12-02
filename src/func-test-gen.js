const jsParser = require('acorn').Parser;
const Util = require('./util.js');

class FuncTestGen {

  // TODO: getter/setter differntiate the same name function getter/setter
  constructor (Klass, funcName) {
    this.Klass = Klass;
    this.funcName = funcName;
    this.classCode = '' + Klass.prototype.constructor;
    this.klassDecl = jsParser.parse(this.classCode).body[0];
    const methodDefinition = this.klassDecl.body.body.find(node => node.key.name === this.funcName);
    if (methodDefinition) {
      this.funcCode = this.classCode.substring(methodDefinition.start, methodDefinition.end);
      this.isAsync = this.funcCode.includes('return __awaiter(this, void 0, void 0, function* ()');
    }
  }

  getCode (node) {
    return this.classCode.substring(node.start, node.end);
  }

  getInitialParameters () {
    const params = {};
    // TODO: getter/setter differntiate the same name function getter/setter
    const methodDefinition = this.klassDecl.body.body.find(node => node.key.name === this.funcName);
    if (methodDefinition) {
      methodDefinition.value.params.forEach(el => (params[el.name] = {}));
    }
    return params;
  }

  getExpressionStatements () {
    const methodDefinition = this.klassDecl.body.body.find(node => node.key.name === this.funcName);
    if (methodDefinition) {
      const block = methodDefinition.value.body;
      return block.body; // array of ExpressionStatements
    }
    return [];
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
      nodeIn.type === 'ArrowFunctionExpression' ? nodeIn:
      nodeIn.type === 'AssignmentExpression' ? nodeIn :
      nodeIn.type === 'BinaryExpression' ? nodeIn :
      nodeIn.type === 'BlockStatement' ? nodeIn :
      nodeIn.type === 'BreakStatement' ? nodeIn :
      nodeIn.type === 'CallExpression' ? nodeIn :
      nodeIn.type === 'CatchClause' ? nodeIn :
      nodeIn.type === 'ConditionalExpression' ? nodeIn :
      // nodeIn.type === 'DeclarationExpressionStatement' ? nodeIn.declarations :
      nodeIn.type === 'ExpressionStatement' ? nodeIn.expression :
      nodeIn.type === 'ForStatement' ? nodeIn.body : // NOTE: init/test/update/body
      nodeIn.type === 'ForInStatement' ? nodeIn :
      nodeIn.type === 'ForOfStatement' ? nodeIn :
      nodeIn.type === 'FunctionExpression' ? nodeIn :
      nodeIn.type === 'Identifier' ? nodeIn :
      nodeIn.type === 'IfStatement' ? nodeIn : // node.test, consequent, alternate
      nodeIn.type === 'Literal' ? nodeIn :
      nodeIn.type === 'LogicalExpression' ? nodeIn :
      nodeIn.type === 'MemberExpression' ? nodeIn :
      nodeIn.type === 'NewExpression' ? nodeIn :
      nodeIn.type === 'ObjectExpression' ? nodeIn :
      nodeIn.type === 'ReturnStatement' ? nodeIn :
      nodeIn.type === 'SpreadElement' ? nodeIn.argument :
      nodeIn.type === 'SwitchStatement' ? nodeIn :
      nodeIn.type === 'TemplateLiteral' ? nodeIn :
      nodeIn.type === 'ThrowStatement' ? nodeIn :
      nodeIn.type === 'ThisExpression' ? nodeIn :
      nodeIn.type === 'TryStatement' ? nodeIn :
      nodeIn.type === 'UpdateExpression' ? nodeIn :
      nodeIn.type === 'UnaryExpression' ? nodeIn.argument :
      nodeIn.type === 'VariableDeclaration' ? nodeIn :
      nodeIn.type === 'WhileStatement' ? nodeIn :
      nodeIn.type === 'YieldExpression' ? nodeIn :
      null; /* eslint-enable */

    if (!node) {
      console.error(`ERROR: Invalid JS node type ${nodeIn.type} '${this.getCode(nodeIn)}'`);
      throw new Error(`ERROR: Invalid JS node type ${nodeIn.type} '${this.getCode(nodeIn)}'`);
    }
    const code = this.getCode(node);

    Util.DEBUG && console.log('    *** EXPRESSION ' + node.type + ' ***', this.getCode(node));
    if ([
      'BreakStatement',
      'Identifier',
      'Literal',
      'ThisExpression',
      'ThrowStatement'
    ].includes(node.type)) {
      // ignore these expressions/statements
    } else if (node.type === 'ArrowFunctionExpression') { // params, body
      this.setMockData(node.body, mockData);
    } else if (node.type === 'FunctionExpression') { // params, body
      this.setMockData(node.body, mockData);
    } else if (node.type === 'NewExpression') {
      node.arguments.forEach(argument => this.setMockData(argument, mockData));
    } else if (node.type === 'ArrayExpression') {
      node.elements.forEach(element => element && this.setMockData(element, mockData));
    } else if (node.type === 'ArrayPattern') {
      node.elements.forEach(element => element && this.setMockData(element, mockData));
    } else if (node.type === 'ForOfStatement') {
      this.setMockData(node.left, mockData);
      this.setMockData(node.right, mockData);
      this.setMockData(node.body, mockData);
    } else if (node.type === 'TemplateLiteral') {
      node.expressions.forEach(expr => expr && this.setMockData(expr, mockData));
    } else if (node.type === 'VariableDeclaration') {
      node.declarations.forEach(decl => {
        decl.init && this.setMockData(decl.init, mockData);
      });
    } else if (node.type === 'ReturnStatement') {
      node.argument && this.setMockData(node.argument, mockData);
    } else if (node.type === 'IfStatement') {
      this.setMockData(node.test, mockData);
      this.setMockData(node.consequent, mockData);
      node.alternate && this.setMockData(node.alternate, mockData);
    } else if (node.type === 'WhileStatement') {
      this.setMockData(node.test, mockData);
      this.setMockData(node.body, mockData);
    } else if (node.type === 'SwitchStatement') {
      this.setMockData(node.discriminant, mockData);
      node.cases.forEach(kase => {
        kase.test && this.setMockData(kase.test, mockData);
        kase.consequent.forEach(stmt => stmt && this.setMockData(stmt, mockData));
      });
    } else if (node.type === 'ConditionalExpression') {
      this.setMockData(node.test, mockData);
      this.setMockData(node.consequent, mockData);
      this.setMockData(node.alternate, mockData);
    } else if (node.type === 'ForInStatement') {
      this.setMockData(node.left, mockData);
      this.setMockData(node.body, mockData);
    } else if (node.type === 'LogicalExpression') {
      this.setMockData(node.left, mockData);
      this.setMockData(node.right, mockData);
    } else if (node.type === 'BlockStatement') {
      node.body.forEach(expr => {
        this.setMockData(expr, mockData);
      });
    } else if (node.type === 'BinaryExpression') {
      this.setMockData(node.right, mockData);
      this.setMockData(node.left, mockData);
    } else if (node.type === 'ObjectExpression') {
      node.properties.forEach(property => {
        this.setMockData(property.value, mockData);
      });
    } else if (node.type === 'TryStatement') {
      this.setMockData(node.block, mockData);
    } else if (node.type === 'UpdateExpression') {
      this.setMockData(node.argument, mockData);
    } else if (node.type === 'CatchClause') {
      this.setMockData(node.block, mockData);
      this.setMockData(node.handler, mockData);
    } else if (node.type === 'WhileExpression') { // this.xxxx, foo.xxxx
      this.setMockData(node.test, mockData);
      this.setMockData(node.body, mockData);
    } else if (node.type === 'YieldExpression') { // this.xxxx, foo.xxxx
      this.setMockData(node.argument, mockData);
    } else if (node.type === 'UnaryExpression') {
      this.setMockData(node.argument, mockData);
    } else if (node.type === 'MemberExpression') { // this.xxxx, foo.xxxx
      this.setPropsOrParams(node, mockData);
    } else if (node.type === 'CallExpression') {
      const funcReturn = Util.getExprReturn(node, this.classCode) || {};
      this.setPropsOrParams(funcReturn.code, mockData, funcReturn.value);
      
      // procesa call arguments
      node.arguments.forEach(argument => {
        this.setMockData(argument, mockData);
      });

      // What if call argument is a function?
      const funcExpArg = Util.getFuncExprArg(node);
      Util.DEBUG && console.log('      *** CallExpression ***', {funcExpArg});
      if (funcExpArg) { // process ArrowFunctionExpression or FunctionExpression
        this.setMockData(funcExpArg, mockData);
      }
    } else if (node.type === 'AssignmentExpression') {
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
        this.setMockData(node.right, mockData); // process the right side expression
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
    let nodeToUse, obj, one, two, code;
    if (typeof codeOrNode === 'string') {
      nodeToUse = Util.getNode(codeOrNode);
      obj = Util.getObjectFromExpression(nodeToUse, returns); // TODO: return function with params, not return
      code = codeOrNode;
      [one, two] = codeOrNode.split('.'); // this.prop
    } else {
      nodeToUse = /* eslint-disable */
        codeOrNode.type === 'LogicalExpression' ? codeOrNode.left :
        codeOrNode.type === 'BinaryExpression' ? codeOrNode.left :
        codeOrNode; /* eslint-enable */
      obj = Util.getObjectFromExpression(nodeToUse, returns);
      code = this.getCode(codeOrNode);
      [one, two] = code.split('.'); // this.prop
      Util.DEBUG && console.log('  setPropsOrParams', { code, type: codeOrNode.type });
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

module.exports = FuncTestGen;
