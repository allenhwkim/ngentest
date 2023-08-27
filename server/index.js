// TODO: ongoing work to run this as an API
// POST /api/gentest
// Payload {
//   typescript: 'xxxxxxxxxxxxxxxxxx',
//   options: e.g. {framework: 'jest', templates: {......}, directives: {.....}}
// }
// Response: {
//   output: string // e.g. '// @ts-nocheck\n import { async, ComponentFixture, TestBed } ...'
// }
const app = require('express')();
const { v4 } = require('uuid');

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

module.exports = app;