const express = require('express');
const fs = require('fs');
const openapiJSDoc = require('openapi-jsdoc');
const swaggerUiAssetPath = require("swagger-ui-dist").absolutePath();

const app = express();

// General

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// Load Functions

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

const modules = walk('./func');
const functions = {};

modules.forEach(module => {
  functions[module.replace('./func/', '').replace('.js', '')] = require(module);
});

// Documentation

const api = openapiJSDoc({
  definition: {
    // info object, see https://swagger.io/specification/#infoObject
    info: {
      title: 'Moonhorse', // required
      version: '1.0.0', // required
      description: 'The Moonhorse API'
    }
  },
  apis: ['./components.yaml', './index.js', './func/**/*.js']
});

app.get('/', (req, res) => {
  res.redirect('/swaggerui/?url=/api-docs.json');
});
app.use('/swaggerui/', express.static(swaggerUiAssetPath));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(api)
});

// Function Helpers

const stack = (req, res, next) => {
  // Populate stack
  req.stack = req.query.a; 
  if (!req.stack) {
    res.stack = [];
  }

  if (!Array.isArray(req.stack)) {
    req.stack = [ req.stack ];
  }

  next();
};

const types = (req, res, next) => {
  req.stack = req.stack.map(val => {
    // To number
    if (!isNaN(+val)) {
      return +val;
    }

    // To bool/null/undefined
    if (val == 'false') {
      return false;
    } else if (val == 'true') {
      return true;
    } else if (val == 'null') {
      return null;
    } else if (val == 'undefined') {
      return undefined;
    }

    return val;
  });   

  next();
};

const skip = (req, res, next) => {
  if (req.query.s && req.query.s > 0) {
    req.query.s--;
    nextEndpoint(req, res);
    return;
  } else {
    next();
  }
};

const nextEndpoint = (req, res) => {
  // Call next
  if (!req.query.next) {
    res.status(200).send({
		_stack: req.stack,
		result: req.stack[req.stack.length - 1],
	});
    return;
  }

  const stackstring = req.stack.map(entry => `a=${encodeURIComponent(entry)}`).join('&');
  const parts = req.query.next.split('?');
  let next = '';
  if (parts.length > 1 && (!req.query.s || (req.query.s && req.query.s <=0))) {
    next = `${parts[0]}?${stackstring}&${parts[1]}${req.query.s ? `&s=${req.query.s}` : ''}`;
  } else {
    next = `${parts[0]}?${stackstring}${req.query.s ? `&s=${req.query.s}` : ''}`;
  }
  res.redirect(next);
};

// Conditionals

app.get('/then', stack, types, skip, (req, res, next) => {
  const skipCount = parseInt(req.query.skip, 10);

  if (req.stack.pop()) {
	  req.query.s = skipCount;
  }

  next();
}, nextEndpoint);

app.get('/skip', stack, types, skip, (req, res, next) => {
  const skipCount = parseInt(req.query.skip, 10);

  req.query.s = skipCount;

  next();
}, nextEndpoint);

// Function Call

app.get('/*', stack, types, skip, (req, res, next) => {
  const functionName = req.params[0];

  // Call function
  if (!functions[functionName]) {
    res.status(404).send(`function ${functionName} not found`);
    return;
  }

  functions[functionName](req.stack);
  next();
}, nextEndpoint);

// Install Handler

app.listen(process.env.PORT, (err) => {
  err ? console.error(err) : console.log(`listening on :${process.env.PORT}`);
});
