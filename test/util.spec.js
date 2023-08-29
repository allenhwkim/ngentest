const { describe, it, beforeEach } = require('node:test');
const assert = require('assert');
const jsParser = require('acorn').Parser;
const Util = require('../src/util.js');

describe('Util', () => {

  it('getFuncArguments(code)', () => {
    assert.deepEqual(Util.getFuncArguments(`foo => foo.bar.baz`), [{bar: {baz: {}}}]);
    assert.deepEqual(Util.getFuncArguments(`(foo,bar) => {}`), [undefined, undefined] );
    assert.deepEqual(Util.getFuncArguments(`([foo,bar]) => {}`), [undefined, undefined] );
    assert.deepEqual(Util.getFuncArguments(`({foo,bar}) => {}`), [{foo:undefined, bar:undefined}]);
  });

  it('getObjectFromExpression(code)', () => {
    const resp = Util.getObjectFromExpression(`foo.bar.x().y`); 
    assert.deepEqual(resp.foo.bar.x().y, {});
    assert.deepEqual(Util.getObjectFromExpression(`foo`), {foo: {}});
  });

  it('getObjFromVarPattern(node)', () => {
    let code, parsed, node;
    code = `const [a,b, [c,d], {e,f}] = p`
    parsed = jsParser.parse(code);
    node = parsed.body[0].declarations[0].id; // id, init
    assert.deepEqual(Util.getObjFromVarPattern(node), [ 'a', 'b', [ 'c', 'd' ], { e: {}, f: {} } ] );

    code = `const {k1, k2, k3, k4} = p`;
    parsed = jsParser.parse(code);
    node = parsed.body[0].declarations[0].id; // id, init
    assert.deepEqual(Util.getObjFromVarPattern(node), { k1: {}, k2: {}, k3: {}, k4: {} });

    code = `const myVar = p`
    parsed = jsParser.parse(code);
    node = parsed.body[0].declarations[0].id; // id, init
    assert.equal(Util.getObjFromVarPattern(node), 'myVar');
  });

  it('objToJs(obj)', () => {
    let obj = { replace : function() {} };
    assert.equal(Util.objToJS(obj), "'ngentest'");
  });

  it('getExprMembers(code)', () => {
    assert.deepEqual(Util.getExprMembers(`foo.bar().x`), [ 'x', '()', 'bar', 'foo' ] )
    assert.deepEqual(Util.getExprMembers(`foo.x.bar()`), [ '()', 'bar', 'x', 'foo' ] )
    assert.deepEqual(Util.getExprMembers(`this`), [ 'this' ] )
    assert.deepEqual(Util.getExprMembers(`foo`), [ 'foo' ] )
  })

  it('getFuncArgNames(code)', () => {
    assert.deepEqual(Util.getFuncArgNames(`myFunc(x => [x.y])`), 'x => [x.y]');
    assert.deepEqual(
      Util.getFuncArgNames(`myFunc(foo, bar, [1,2], a||b, x(), foo.bar, {}, a ? b:c)`),
      'foo,bar,[],LOGI_EXPR,CALL_EXPR,MBR_EXPR,OBJ_EXPR,COND_EXPR'
    );
  });

  it('getFuncReturn(code)', () => {
    assert.deepEqual(Util.getFuncReturn(`x.y.z(foo => foo.bar.baz)`), [ { bar: { baz: {} } } ]);
    assert.equal(Util.getFuncReturn(`x.y.z()`), undefined);
  });

  it('getFuncParamObj(code)', () => {
    assert.deepEqual(Util.getFuncReturn(`x.y.z(foo => foo.bar.baz)`), [ { bar: { baz: {} } } ]);
    assert.equal(Util.getFuncReturn(`x.y.z()`), undefined);
  });
});