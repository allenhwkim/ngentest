var Parser = require('../src/typescript-parser.js');

var typescript = `
@Component({
  selector: 'app-root',
  template: '<div>Example Component</div>',
  styles: [''],
  providers: [FooKlass],
  x: {foo:1, bar:2}
})
class X {}
`;

var parsed = new Parser(typescript);
const klassDecorator = {};
parsed.rootNode.get('ClassDeclaration')
  .get('Decorator')
  .get('CallExpression')
  .get('ObjectLiteralExpression')
  .get('PropertyAssignment')
  .forEach(el => {
    const key = el.children[0].node.escapedText;
    const value = el.children[1].node;
    klassDecorator[key] = value;
   })

console.log(klassDecorator)
