const express = require('express');

const app = express();

const functions = {

};

app.use((req, res, next) => {
  req.stack = req.query.stack; 
  if (!req.stack) {
    res.sendStatus(400);
    return;
  }

  if (!Array.isArray(req.stack)) {
    req.stack = [ req.stack ];
  }

  next();
});

const nextFunc = (req, res) => {
  if (!req.next) {
    res.send(req.stack);
    return;
  }



  res.redirect(`/${req.next}`);
};

app.get('/', (req, res) => {
  res.send(req.stack);
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
