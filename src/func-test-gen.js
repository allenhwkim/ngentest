const jsParser = require('acorn').Parser;
const Util = require('./util.js');

class FuncTestGen {

  // TODO: differntiate the same name getter/setter function getter/setter
  constructor (Klass, funcName, funcType) {
    this.Klass = Klass;
    this.funcName = funcName;
    this.funcType = funcType; // constructor, get, set, method
    this.classCode = '' + Klass.prototype.constructor;
    this.klassDecl = jsParser.parse(this.classCode).body[0];
    const methodDefinition = this.klassDecl.body.body.find(node => {
      return (node.kind === this.funcType) && (node.key.name === this.funcName);
    });
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
    const methodDefinition = this.klassDecl.body.body.find(node => {
      return (node.kind === this.funcType) && (node.key.name === this.funcName);
    });
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
  setMockData (node, mockData, returnValue) { // node: ExpressionStatement
    if (!node) return;

    Util.DEBUG && console.log('    *** EXPRESSION ' + node.type + ' ***', this.getCode(node));
    if ([
      'BreakStatement',
      'Identifier',
      'Literal',
      'ThisExpression',
      'ThrowStatement',
      'ContinueStatement',
      'DebuggerStatement'
    ].includes(node.type)) {
      // ignore these expressions/statements, which is meaningless for mockData
    } else if (node.type === 'ArrayExpression') {
      node.elements.forEach(element => {
        this.setMockData(element, mockData);
      });
    } else if (node.type === 'ArrayPattern') {
      node.elements.forEach(element => {
        this.setMockData(element, mockData)
      });
    } else if (node.type === 'ArrowFunctionExpression') { // params, body
      this.setMockData(node.body, mockData);
    } else if (node.type === 'BinaryExpression') {
      this.setMockData(node.right, mockData);
      this.setMockData(node.left, mockData);
    } else if (node.type === 'BlockStatement') {
      node.body.forEach(expr => {
        this.setMockData(expr, mockData);
      });
    } else if (node.type === 'CatchClause') {
      this.setMockData(node.block, mockData);
      this.setMockData(node.handler, mockData);
    } else if (node.type === 'ConditionalExpression') {
      this.setMockData(node.test, mockData);
      this.setMockData(node.consequent, mockData);
      this.setMockData(node.alternate, mockData);
    } else if (node.type === 'ExpressionStatement') {
      this.setMockData(node.expression, mockData);
    } else if (node.type === 'ForInStatement') {
      this.setMockData(node.left, mockData);
      this.setMockData(node.body, mockData);
    } else if (node.type === 'ForOfStatement') {
      this.setMockData(node.left, mockData);
      this.setMockData(node.right, mockData);
      this.setMockData(node.body, mockData);
    } else if (node.type === 'ForStatement') {// init, test, updte, boby
      this.setMockData(node.body, mockData);
    } else if (node.type === 'FunctionExpression') { // params, body
      this.setMockData(node.body, mockData);
    } else if (node.type === 'IfStatement') {
      this.setMockData(node.test, mockData);
      this.setMockData(node.consequent, mockData);
      this.setMockData(node.alternate, mockData);
    } else if (node.type === 'LogicalExpression') {
      this.setMockData(node.left, mockData);
      this.setMockData(node.right, mockData);
    } else if (node.type === 'NewExpression') {
      node.arguments.forEach(argument => {
        this.setMockData(argument, mockData)
      });
    } else if (node.type === 'ObjectExpression') {
      node.properties.forEach(property => {
        this.setMockData(property.value, mockData);
      });
    } else if (node.type === 'ReturnStatement') {
      this.setMockData(node.argument, mockData);
    } else if (node.type === 'SpreadElement') {
      this.setMockData(node.argument, mockData);
    } else if (node.type === 'SwitchStatement') {
      this.setMockData(node.discriminant, mockData);
      node.cases.forEach(kase => {
        this.setMockData(kase.test, mockData);
        kase.consequent.forEach(stmt => this.setMockData(stmt, mockData));
      });
    } else if (node.type === 'TemplateLiteral') {
      node.expressions.forEach(expr => this.setMockData(expr, mockData));
    } else if (node.type === 'TryStatement') {
      this.setMockData(node.block, mockData);
    } else if (node.type === 'UnaryExpression') {
      this.setMockData(node.argument, mockData);
    } else if (node.type === 'UpdateExpression') {
      this.setMockData(node.argument, mockData);
    } else if (node.type === 'VariableDeclaration') {
      node.declarations.forEach(decl => { // decl.id, decl.init
        this.setMockDataMap(decl, mockData);
        const declReturn = Util.getObjFromVarPattern(decl.id);
        this.setMockData(decl.init, mockData, declReturn);
      });
    } else if (node.type === 'WhileStatement') {
      this.setMockData(node.test, mockData);
      this.setMockData(node.body, mockData);
    } else if (node.type === 'WhileExpression') {
      this.setMockData(node.test, mockData);
      this.setMockData(node.body, mockData);
    } else if (node.type === 'YieldExpression') {
      this.setMockData(node.argument, mockData);
    } else if (node.type === 'AssignmentExpression') {
      const mapped = this.setMockDataMap(node, mockData); // setting map data for this expression
      if (mapped.type !== 'param') { // do NOT remove this
        // skip param mapping e.g. `this.param = param`, which causes a bug. 
        // map, `map[this.param] = param` will be used later
        this.setMockData(node.right, mockData);
        this.setMockData(node.left, mockData);
      }
    } else if (node.type === 'CallExpression') { // callee, arguments
      const kode = this.getCode(node);
      const funcReturn = Util.getFuncReturn(kode);
      const exprReturnValue = returnValue || funcReturn;
      this.setPropsOrParams(kode, mockData, exprReturnValue);
      
      this.setMockData(node.callee, mockData);
      node.arguments.forEach(argument => this.setMockData(argument, mockData));

      // const funcExpArg = Util.isFunctionExpr(node) && node.arguments[0];
      // if (funcExpArg) { // when call arg is a function, process a FunctionExpression
      //   this.setMockData(funcExpArg, mockData);
      // }
    } else if (node.type === 'MemberExpression') {
      this.setPropsOrParams(node, mockData);
      this.setMockData(node.object, mockData);
    } else {
      console.error(`ERROR: Invalid JS node type ${node.type} '${this.getCode(node)}'`);
      throw new Error(`ERROR: Invalid JS node type ${node.type} '${this.getCode(node)}'`);
    }
  }

  /**
   * set mockdata map for AssignmentExpression return mapped key and value
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
    const rightTypes = ['LogicalExpression', 'MemberExpression', 'CallExpression', 'Identifier'];
    if (node.type === 'AssignmentExpression' && rightTypes.includes(node.right.type)) {
      nodeLeft = node.left;
      nodeRight = node.right.type === 'LogicalExpression' ? node.right.left : node.right;
    } else if (node.type === 'VariableDeclarator' && node.init) {
      if (rightTypes.includes(node.init.type)) {
        nodeLeft = node.id;
        nodeRight = node.init.type === 'LogicalExpression' ? node.init.left : node.init;
      }
    }

    let mapped = {};
    if ( // ignore if left-side is a ObjectExpression or Array Pattern
      nodeLeft && nodeRight && ['Identifier', 'MemberExpression'].includes(nodeLeft.type) 
    ) {
      const [leftCode, rightCode] = [this.getCode(nodeLeft), this.getCode(nodeRight)];
      const paramNames = Object.keys(mockData.params);
      const paramMatchRE = paramNames.length ?
        new RegExp(`^(${paramNames.join('|')})$`) : undefined;

      // only if left-side is a this.llll or llll
      if (leftCode.match(/^this\.[a-zA-Z0-9_$]+$/) || leftCode.match(/^[a-zA-Z0-9_$]+$/)) {
        const numLeftCodeRepeats = 
          (this.funcCode.match(new RegExp(`[^\\.]${leftCode}\\.`, 'g')) || []).length;

        const rightCodeVarName = rightCode.replace(/\s+/g,'').replace(/\(.*\)/g,'()')
        if (!mockData.map[leftCode] && paramMatchRE && rightCode.match(paramMatchRE)) {
          if (leftCode !== rightCodeVarName) { // ignore map to the same name, it causes a bug
            mockData.map[leftCode] = rightCodeVarName;
            mapped = {type: 'param', key: leftCode, value: rightCodeVarName};
          }
        // or right-side starts with . this.xxxx 
        } else if (!mockData.map[leftCode] && numLeftCodeRepeats > 0) { 
          mockData.map[leftCode] = rightCodeVarName;
          mapped = {type: 'this', key: leftCode, value: rightCodeVarName};
        }
      }
    }

    return mapped;
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
    }
    Util.DEBUG && console.log('      ** setPropsOrParams', { one, two, code });

    const variableExpression = code.replace(/\s+/g,'').replace(/\(.*\)/g,'');
    const mapKey = (variableExpression.match(/(this\.)?[a-zA-Z0-9_\$]+/) || [])[0]; // foo or this.foo
    const exprFoundInMap = Object.entries(map).find( // set map only if `expression.` is used
      ([k, v]) => variableExpression.startsWith(k + '.')
    );
    const loopCondition = exprFoundInMap &&
      exprFoundInMap[1].startsWith(exprFoundInMap[0]);

    if (map[mapKey] && params[map[mapKey]]) { // if param mapped
      if (one === 'this' && two && map[`this.${two}`]) { // if param map found
        Util.merge(obj.this, params);
      } else {
        Util.merge(code, obj, params);
      }
    } else if (map[mapKey] && exprFoundInMap && !loopCondition) { // if non-param map found
      const newlyMappedCode = code.replace(mapKey, map[mapKey]);
      this.setPropsOrParams(newlyMappedCode, mockData, returns);
    } else {
      if (one === 'this' && two) {
        Util.merge(obj.this, props);
      } else if (params[one] && two) {
        Util.merge(obj, params);
      } else if (one === 'window' || obj === 'document') {
        Util.merge(obj, globals);
      }
    }
  }

}

module.exports = FuncTestGen;
