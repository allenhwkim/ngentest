const { describe, it, beforeEach } = require('node:test');
const assert = require('assert');
const Parser = require('../src/typescript-parser.js');

const typescript = `
  @Component({
    selector: 'app-root',
    template: '<div>Example Component</div>',
    styles: [''],
    providers: [FooKlass],
    x: {foo:1, bar:2}
  })
  class X {}`;

describe('TypescriptParser', () => {
  var klassDecorator;

  beforeEach(() => {
    klassDecorator = {};
    const parser = new Parser(typescript);
    parser.rootNode.get('ClassDeclaration')
      .get('Decorator')
      .get('CallExpression')
      .get('ObjectLiteralExpression')
      .get('PropertyAssignment')
      .forEach(el => {
        const key = el.children[0].node.escapedText;
        const value = el.children[1].node;
        klassDecorator[key] = value;
      })
  });

  it('should work', () => {
    assert.equal(klassDecorator.selector?.text, 'app-root');
    assert.equal(klassDecorator.template?.text, '<div>Example Component</div>');
    assert.equal(klassDecorator.styles?.elements?.[0]?.text, '');
    assert.equal(klassDecorator.providers?.elements?.[0]?.escapedText, 'FooKlass');
    assert.equal(klassDecorator.x.properties?.[0]?.name?.escapedText, 'foo');
    assert.equal(klassDecorator.x.properties?.[1]?.name?.escapedText, 'bar');
  });
}); 