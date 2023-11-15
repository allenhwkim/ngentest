/**
 * this express server on Vercel requires vercel.json
 * {
 *   "rewrites": [{ "source": "/api/(.*)", "destination": "/api" }]
 * }
 */
const express = require('express');
const cors = require('cors');
const app = express();
const ngentest = require('../lib/index.js');
const package = require('../package.json');

app.use(express.json());
app.use(cors({
  origin: '*', // e.g., ["http://example1.com"]
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
}));

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
  try{
    const output = ngentest(typescript, options);
    res.send({output})
  } catch(e) {
    res.send({output: e.toString()})
  }
});

module.exports = app;