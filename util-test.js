const jsParser = require('acorn').Parser;
const Util = require('./src/util.js');
let code, node;

code = 'foo.bar[0].x.y.z()';
node = Util.getNode('foo.bar[0].x.y.z()')
console.log('Util.getExprMembers(node)');
console.log({ code,  result: Util.getExprMembers(node) });
console.log('-'.repeat(80));

code = `myFunc(a,b,c)`;
node = Util.getNode(code);
console.log('Util.getFuncArgNames(node)');
console.log({ code,  result: Util.getFuncArgNames(node) });
console.log('-'.repeat(80));

code = `foo.bar.baz.substr(1)`;
node = Util.getNode(code);
console.log('Util.getExprReturn(node, code)');
console.log({ code,  result: Util.getExprReturn(node, code) });
console.log('-'.repeat(80));

code = `foo.bar.baz.map(ret => ret)`;
node = Util.getNode(code);
console.log('Util.getExprReturn(node, code)');
console.log({ code,  result: Util.getExprReturn(node, code) });
console.log('-'.repeat(80));

code = `foo.bar.baz.subscribe(ret => ret)`;
node = Util.getNode(code);
console.log('Util.getExprReturn(node, code)');
console.log({ code,  result: Util.getExprReturn(node, code) });
console.log('-'.repeat(80));

code = `foo.bar.baz(event => { event.x.y.z(); })`;
node = Util.getNode(code).arguments[0];
console.log('Util.getFuncParamObj(node, code)');
console.log({ code,  result: Util.getFuncParamObj(node, code) });
console.log('-'.repeat(80));

code = `foo.bar.x().y`;
node = Util.getNode(code);
console.log('Util.getObjectFromExpression(node)', { code });
console.log('result: ',  Util.objToJS( Util.getObjectFromExpression(node)) );
console.log('-'.repeat(80));


