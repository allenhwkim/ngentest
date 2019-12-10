const jsParser = require('acorn').Parser;
const Util = require('../src/util.js');
let parsed, code, node, obj;

// code = `group => group.featureGroup.label.en === 'Data'`;
// node = Util.getNode(code);
// console.log('Util.getFuncArguments(node, code)', { code });
// console.log('util-test result: ',  Util.objToJS( Util.getFuncArguments(node, code)) );
// console.log('-'.repeat(80));

code = `this.dates.reduce((acc, val) => acc + +val.totalUsageThisDate, 0) / this.dates.length`;
console.log({ code,  result: Util.getObjectFromExpression(code) });
console.log('-'.repeat(80));

// code = `foo.bar.baz( ([foo, event]) => { event.x.y.z(); foo.bar.x.y = 1; })`;
// node = Util.getNode(code).arguments[0];
// console.log('Util.getFuncArguments(node, code)');
// console.log({ code,  result: Util.getFuncArguments(node, code) });
// console.log('-'.repeat(80));
// 
// code = `foo.bar.baz( (foo) => { event.x.y.z(); foo.bar.x.y = 1; })`;
// node = Util.getNode(code).arguments[0];
// console.log('Util.getFuncArguments(node, code)');
// console.log({ code,  result: Util.getFuncArguments(node, code) });
// console.log('-'.repeat(80));
// 
// code = `foo.bar.baz( (foo, event) => { event.x.y.z(); foo.bar.x.y = 1; })`;
// node = Util.getNode(code).arguments[0];
// console.log('Util.getFuncArguments(node, code)');
// console.log({ code,  result: Util.getFuncArguments(node, code) });
// console.log('-'.repeat(80));
// 
// code = `foo.bar.baz( ({foo, event}) => { event.x.y.z(); foo.bar.x.y = 1; })`;
// node = Util.getNode(code).arguments[0];
// console.log('Util.getFuncArguments(node, code)');
// console.log({ code,  result: Util.getFuncArguments(node, code) });
// console.log('-'.repeat(80));
// 
// code = `pricePlansCurrent.featureGroupList.subscribe(group => group.featureGroup.label.en === \'Data\')[0]`;
// node = Util.getNode(code);
// console.log('Util.getObjectFromExpression(node)', { code });
// console.log('util-test result: ',  Util.objToJS( Util.getObjectFromExpression(node, {}, code)) );
// console.log('-'.repeat(80));
// 
// code = `const [a,b, [c,d], {e,f}] = p`
// parsed = jsParser.parse(code);
// node = parsed.body[0].declarations[0].id; // id, init
// console.log('Util.getObjFromVarPattern(node)', Util.getObjFromVarPattern(node));
// 
// code = `const {k1, k2, k3, k4} = p`
// parsed = jsParser.parse(code);
// node = parsed.body[0].declarations[0].id; // id, init
// console.log('Util.getObjFromVarPattern(node)', Util.getObjFromVarPattern(node));
// 
// code = `const myVar = p`
// parsed = jsParser.parse(code);
// node = parsed.body[0].declarations[0].id; // id, init
// console.log('Util.getObjFromVarPattern(node)', Util.getObjFromVarPattern(node));
// 
// obj = { replace : function() {} };
// console.log('Util.objToJS(obj)', '{ replace : function() {} }');
// console.log({ obj,  result: Util.objToJS(obj) });
// console.log('-'.repeat(80));
// 
// code = 'foo.bar[0].x.y.z()';
// node = Util.getNode('foo.bar[0].x.y.z()')
// console.log('Util.getExprMembers(node)');
// console.log({ code,  result: Util.getExprMembers(node) });
// console.log('-'.repeat(80));
// 
// code = `myFunc(a,b,c)`;
// node = Util.getNode(code);
// console.log('Util.getFuncArgNames(node)');
// console.log({ code,  result: Util.getFuncArgNames(node) });
// console.log('-'.repeat(80));
// 
// code = `foo.bar.baz.substr(1)`;
// node = Util.getNode(code);
// console.log('Util.getExprReturn(node, code)');
// console.log({ code,  result: Util.getExprReturn(node, code) });
// console.log('-'.repeat(80));
// 
// code = `foo.bar.baz.map(ret => ret)`;
// node = Util.getNode(code);
// console.log('Util.getExprReturn(node, code)');
// console.log({ code,  result: Util.getExprReturn(node, code) });
// console.log('-'.repeat(80));
// 
// code = `foo.bar.baz.subscribe(ret => ret)`;
// node = Util.getNode(code);
// console.log('Util.getExprReturn(node, code)');
// console.log({ code,  result: Util.getExprReturn(node, code) });
// console.log('-'.repeat(80));
// 
 
