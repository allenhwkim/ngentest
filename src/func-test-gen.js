const jsParser = require('acorn').Parser;
const Util = require('./util.js');

class FuncTestGen {

  // TODO: differntiate the same name getter/setter function getter/setter
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
    // TODO:  differntiate the same name function getter/setter
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
  setMockData (nodeIn, mockData, returnValue) { // node: ExpressionStatement
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
      node.declarations.forEach(decl => { // decl.id, decl.init
        this.setMockDataMap(decl, mockData);
        const declReturn = Util.getObjFromVarPattern(decl.id);
        decl.init && this.setMockData(decl.init, mockData, declReturn);
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
      this.setMockData(node.object, mockData);
    } else if (node.type === 'CallExpression') { // callee, arguments
      const kode = this.getCode(node);
      const funcReturn = Util.getFuncReturn(kode);
      const exprReturnValue = returnValue || funcReturn;
      this.setPropsOrParams(kode, mockData, exprReturnValue);
      
      this.setMockData(node.callee, mockData);
      // procesa call arguments
      node.arguments.forEach(argument => {
        this.setMockData(argument, mockData);
      });

      // What if call argument is a function?
      const funcExpArg = Util.isFunctionExpr(node) && node.arguments[0];
      Util.DEBUG && console.log('      *** CallExpression ***', {funcExpArg});
      if (funcExpArg) { // process ArrowFunctionExpression or FunctionExpression
        this.setMockData(funcExpArg, mockData);
      }
    } else if (node.type === 'AssignmentExpression') {
      this.setMockDataMap(node, mockData); // setting map data for this expression

      const nodeRight = node.right.type === 'LogicalExpression' ? node.right.left : node.right;
      const nodeLeft = node.left;
      const leftCode = this.getCode(nodeLeft);
      const rightCode = this.getCode(nodeRight);

      const [left1, left2, left3] = leftCode.split('.'); // this.prop
      const [right1, right2] = rightCode.split('.'); // param
      const { params, map } = mockData;

      const right = Util.getObjectFromExpression(rightCode);

      if (left1 === 'this' && left2 && !left3 && params[right1] && !right2) {
        // set map between params to `this value`. e.g. this.foo = param1
        map[`this.${left2}`] = right1;
      } else if (left1 === 'this' && right1 === 'this' && map[`this.${right2}`]) {
        // set param value instead of 'this'(prop) value 
        // e.g., this.bar = this.foo.x.y (`this.foo` is from param1)
        this.setMockData(node.right, mockData); // process the right side expression
        Util.merge(right.this, params); // (source, target)
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
   * set mockdata map for AssignmentExpression
   * only if right-side source start with . this.xxxx or a parameter
   *   and left-side target is following
   *      . starts with this.yyyy or yyyy
   *      . and this.yyyy or yyyy used in this.funcCode at least twice. search it with this.xxx. or xxx.
   *      . e.g., `\{\nxxx.yyy.zzz, \n   xx.yy \n foo.bar.xxx.yyy\n\n this.a=xxx.yys`.match(/[^\.]xxx\./g)
   */
  setMockDataMap(node, mockData) {
    if (!['AssignmentExpression', 'VariableDeclarator'].includes(node.type))
      throw '%%%%%%%%%%%%%%% Error in setMockDataMap type, ' + node.type;

    let nodeLeft, nodeRight;
    const rightTypes = ['LogicalExpression', 'MemberExpression', 'CallExpression'];
    if (node.type === 'AssignmentExpression' && rightTypes.includes(node.right.type)) {
      nodeLeft = node.left;
      nodeRight = node.right.type === 'LogicalExpression' ? node.right.left : node.right;
    } else if (node.type === 'VariableDeclarator' && node.init) {
      if (rightTypes.includes(node.init.type)) {
        nodeLeft = node.id;
        nodeRight = node.init.type === 'LogicalExpression' ? node.init.left : node.init;
      }
    }

    if ( // ignore if left-side is a ObjectExpression or Array Pattern
      nodeLeft && nodeRight &&
      ['Identifier', 'MemberExpression'].includes(nodeLeft.type) && 
      ['MemberExpression', 'CallExpression'].includes(nodeRight.type)
    ) {
      const [leftCode, rightCode] = [this.getCode(nodeLeft), this.getCode(nodeRight)];
      const paramNames = Object.keys(mockData.params);
      // const paramMatchRE = paramNames.length && new RegExp(`^(${paramNames.join('|')})$`);

      // only if left-side is a this.llll or llll
      if (leftCode.match(/^this\.[a-zA-Z0-9_$]+$/) || leftCode.match(/^[a-zA-Z0-9_$]+$/)) {
        const numLeftCodeRepeats = 
          (this.funcCode.match(new RegExp(`[^\\.]${leftCode}\\.`, 'g')) || []).length;

        const rightCodeVarName = rightCode.replace(/\s+/g,'').replace(/\(.*\)/g,'()')
        // or right-side starts with . this.xxxx 
        // if (!mockData.map[leftCode] && rightCode.match(/^this\./) && numLeftCodeRepeats > 1) { 
        if (!mockData.map[leftCode] && numLeftCodeRepeats > 0) { 
          !mockData.map[leftCode] && (mockData.map[leftCode] = rightCodeVarName);
        }
      }

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
      code = codeOrNode;
      obj = Util.getObjectFromExpression(code, returns);
      [one, two] = codeOrNode.split('.'); // this.prop
    } else {
      nodeToUse = /* eslint-disable */
        codeOrNode.type === 'LogicalExpression' ? codeOrNode.left :
        codeOrNode.type === 'BinaryExpression' ? codeOrNode.left :
        codeOrNode; /* eslint-enable */
      code = this.getCode(codeOrNode);
      obj = Util.getObjectFromExpression(code, returns);
      [one, two] = code.split('.'); // this.prop
      Util.DEBUG && console.log('      ** setPropsOrParams', { code, type: codeOrNode.type });
    }

    Util.DEBUG && console.log('      ** setPropsOrParams', { one, two});

    const variableExpression = code.replace(/\s+/g,'').replace(/\(.*\)/g,'');
    const mapKey = (variableExpression.match(/(this\.)?[a-zA-Z0-9_\$]+/) || [])[0]; // foo or this.foo
    const exprFoundInMap = Object.entries(map).find( ([k, v]) => variableExpression.startsWith(k + '.'));

    if (map[mapKey] && params[map[mapKey]]) {
      if (one === 'this' && two && map[`this.${two}`]) { // parameter map found
        Util.merge(obj.this, params);
      } 
    } else if (map[mapKey] && exprFoundInMap) {
      const newlyMappedCode = code.replace(mapKey, map[mapKey]);
      // console.log(`      ** setPropsOrParams func map found in "${variableExpression}"`);
      // console.log('       ', `{${mapKey}: {${map[mapKey]}}`, {map});
      // console.log('       ', {newlyMappedCode});
      this.setPropsOrParams (newlyMappedCode, mockData, returns)
    } else {
      if (one === 'this' && two) {
        Util.merge(obj.this, props);
      } else if (params[one] && two) {
        Util.merge(obj, params);
      } else if (one === 'window' || obj === 'document') {
        Util.merge(obj, globals);
      }
    }
    // handle mapping only for two cases xxxx, or this.xxxx, NOT this.xxx.yyy
  }

}

module.exports = FuncTestGen;
