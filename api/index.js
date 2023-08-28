// TODO: ongoing work to run this as an API
// POST /api/gentest
// Payload {
//   typescript: 'xxxxxxxxxxxxxxxxxx',
//   options: e.g. {framework: 'jest', templates: {......}, directives: {.....}}
// }
// Response: {
//   output: string // e.g. '// @ts-nocheck\n import { async, ComponentFixture, TestBed } ...'
// }
/**
 * this express server on Vercel requires vercel.json
 * {
 *   "rewrites": [{ "source": "/api/(.*)", "destination": "/api" }]
 * }
 */
const app = require('express')();
const ngentest = require('../src/index.js');

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! ngentest on Vercel`);
});

app.get('/api/ngentest', (req, res) => {
  const typescript = `
    @Component({
      selector: 'app-root',
      template: '<div>Example Component</div>',
      styles: [''],
      providers: [FooKlass],
      x: {foo:1, bar:2}
    })
    class MyTestComponent {}`;
  res.end(ngentest(typescript, {tsPath: './my-test.component.ts'}));
});

module.exports = app;