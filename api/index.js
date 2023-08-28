/**
 * this express server on Vercel requires vercel.json
 * {
 *   "rewrites": [{ "source": "/api/(.*)", "destination": "/api" }]
 * }
 */
const express = require('express');
const app = express();
const ngentest = require('../src/index.js');
const package = require('../package.json');

app.use(express.json());

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`
<h1>Welcome to ngentest@${package.version} on Vercel</h1>
<b>Usage Example</b>
<pre>
  fetch('/api/ngentest', {
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({
        typescript: 
          "@Component({selector: 'app-root'})" +
          "class MyTestComponent {}"
      })
    }).then(resp => resp.json())
    .then(resp => console.log(resp.output))
</pre>
  `);
});

/**
 * fetch('/api/ngentest', {
 *   method: 'POST',
 *   headers: {
 *     'Accept': 'application/json',
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({
 *     typescript: `
 *       @Component({
 *         selector: 'app-root',
 *         template: '<div>Example Component</div>',
 *         styles: [''],
 *         providers: [FooKlass],
 *         x: {foo:1, bar:2}
 *       })
 *       class MyTestComponent {}`,
 *       options: { 
 *         tsPath: './my-test.component.ts' 
 *       }
 *     })
 * }).then(resp => resp.json())
 * .then(resp => console.log(resp))
 */
app.post('/api/ngentest', (req, res) => {
  const {typescript, options = {}} = req.body;
  const output = ngentest(typescript, options);
  res.send({output})
});

module.exports = app;