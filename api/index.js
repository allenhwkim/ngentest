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

app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! ngentest on Vercel`);
});

app.get('/api/ngentest', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

module.exports = app;