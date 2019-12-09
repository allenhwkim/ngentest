var fs = require('fs');
var Parser = require('./src/typescript-parser.js');
var file = `examples/example.component.ts`;
var typescript = fs.readFileSync(file, 'utf8');
var parsed = new Parser(typescript);

console.log('....', parsed.rootNode.get('ClassDeclaration'));
