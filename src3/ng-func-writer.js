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
    return this.methodDefinition.value.params.reduce((accu, el) => {
      accu[el.name] = undefined;
    }, {});
  }

  get expressions () {
    const block = this.methodDefinition.body;
    return block.body; // array of ExpressionStatements
  }

  constructor (klass, funcName) {
    this.klass = klass;
    this.funcName = funcName;
    this.classCode = '' + klass.prototype.constructor;
    this.klassDecl = jsParser.parse(this.classCode).body[0];

    this.instanceProps = {};
    this.funcParams = Object.assign({}, this.parameters);
  }

  getNodeCode (node) {
    return this.classCode.substring(node.start, node.end);
  }

  getPropsAndParms (node) { // node: ExpressionStatement
    const expr = node.expression;
    const code = this.getNodeCode(expr);
    const [props, params] = [{}, {}];
    if (expr.type === 'AssignmentExpression') {
      this.fromAssignmentExpression(expr);
    }
    return { code, props, params };
  }

  fromAssignmentExpression (node) {
    const right = node.right;
    const varMembers =
      right.type === 'MemberExpression' ? this._getMemberObjects(right) :
        right.type === 'Identifier' ? [right.name] : [];
    console.log('varMembers....', varMembers);

    let tmpObj;
    varMembers.forEach(el => {
      // THIS -> this.instanceProps
      // function() {} ->
      // anyVar ->
      const var = tmpObj[el];
    });
  }

  _getVarMembers (node, result = []) { // node: MemberExpression, CallExpression
    const { type, property, object, callee } = node;
    const member =
      type === 'MemberExpression' ? property.name :
        type === 'CallExpression' ? '()' :
          type === 'ThisExpression' ? 'THIS' : undefined;
    result.push(member);

    if (object) {
      result = this._getMemberObjects(object, result);
    } else if (callee) {
      result = this._getMemberObjects(callee, result);
    }
    return result;
  }

}

module.exports = NgFuncWriter;

// const jsFuncBlock = jsParsed.value.body;
// const jsFuncStatements = jsFuncBlock.body;
// console.log('>>>> >>>>> jsFiuncStatements', jsFuncStatements); // ExpressionStatement -> expression ->  left, right
// console.log('>>>> >>>>> statements', jsFuncStatements.map(node => testWriter.getJSCode(Klass, node)));
// console.log('>>>> >>>>> >>>>>>', jsFuncStatements.map(node => testWriter.getJSCode(Klass, node.expression.right))); // ExpressionStatement -> expression ->  left, right
// instanceProps  = {}
// funcParms = {} ... constructor params
