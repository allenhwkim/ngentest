const ts = require('typescript');

class TypescriptParser {
  constructor(code) {
    const sourceFile = ts.createSourceFile('temp.ts', code, ts.ScriptTarget.Latest);
    this.rootNode = this.getRecursiveFrom(sourceFile, sourceFile);
  }

  getRecursiveFrom(node, sourceFile) {
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(sourceFile);
    const children = [];
    node.forEachChild(child => {
      children.push(this.getRecursiveFrom(child, sourceFile));
    });
    const getFunc = function() { return {get: getFunc} }
    const get = function(kind) {
      const all = this.children.filter(el => el.syntaxKind === kind);
      return all.length === 0 ? {get: getFunc} : 
        all.length === 1 ? all[0] :
        all;
    } 
    return {node, syntaxKind, nodeText, children, get};
  }
}

module.exports = TypescriptParser;

// 
// var Parser = require('./src/typescript-parser.js');
// 
// var typescript = `
// @Component({
//   selector: 'app-root',
//   template: '<div>Example Component</div>',
//   styles: [''],
//   providers: [FooKlass],
//   x: {foo:1, bar:2}
// })
// class X {}
// `;
// 
// var parsed = new Parser(typescript);
// const klassDecorator = {};
// parsed.rootNode.get('ClassDeclaration')
//   .get('Decorator')
//   .get('CallExpression')
//   .get('ObjectLiteralExpression')
//   .get('PropertyAssignment')
//   .forEach(el => {
//     const key = el.children[0].node.escapedText;
//     const value = el.children[1].node;
//     klassDecorator[key] = value;
//    })
// 
// console.log(klassDecorator)