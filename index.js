const fs = require('fs');

const express = require('express');
const openapiJSDoc = require('openapi-jsdoc');
const swaggerUiAssetPath = require("swagger-ui-dist").absolutePath();

const app = express();

const walk = (dir) => {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else { 
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}

const functions = {};
const modules = walk('./func');
modules.forEach(module => {
  functions[module.replace('./func/', '').replace('.js', '')] = require(module);
});

const api = openapiJSDoc({
  definition: {
    // info object, see https://swagger.io/specification/#infoObject
    info: {
      title: 'Moonhorse', // required
      version: '1.0.0', // required
      description: 'The Moonhorse API'
    }
  },
  apis: ['./index.js', './func/**/*.js']
});

app.get('/documentation', (req, res) => {
  res.redirect('/documentation/static/?url=/api-docs.json');
});
app.use('/documentation/static/', express.static(swaggerUiAssetPath));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(api)
});

app.get('/:function', (req, res) => {
  // Populate stack
  req.stack = req.query.a; 
  if (!req.stack) {
    res.stack = [];
    return;
  }

  if (!Array.isArray(req.stack)) {
    req.stack = [ req.stack ];
  }

  if (req.query.skip && req.query.skip > 0 ) {
    req.query.skip--;
  } else {
    // Call function
    if (!functions[req.params.function]) {
      res.status(404).send(`function ${req.params.function} not found`);
      return;
    }

    const { stack, skip } = functions[req.params.function](req.stack);
    req.stack = stack;
    req.skip = skip;
  }

  // Call next
  if (!req.query.next) {
    res.status(200).send(req.stack);
    return;
  }

  const stackstring = req.stack.map(entry => `a=${encodeURIComponent(entry)}`).join('&');
  const parts = req.query.next.split('?');
  let next = '';
  if (parts.length > 1) {
    next = `/${parts[0]}?${stackstring}&skip=${req.query.skip}&${parts[1]}`;
  } else {
    next = `/${parts[0]}?${stackstring}&skip=${req.query.skip}`;
  }
  res.redirect(next);
});

app.listen(process.env.PORT, (err) => {
  err ? console.error(err) : console.log(`listening on :${process.env.PORT}`);
});
