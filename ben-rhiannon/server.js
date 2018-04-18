'use strict';

const express = require('express');
const bodyParser = require('body-parser').urlencoded({extended: true});
let app = express();

const PORT = process.env.PORT || 3000;

//COMMENT: Include a comment to explain why our files are in a "public" directory now and how ExpressJS serves our local files.
// basically, ummm, the public directory is a directory that refers to all our site files and then using this .use method to tell the server that this is the information that we are wanting to render the whole page from. -ben (dictated not read)
app.use(express.static('./public'));

app.get('/new', (request, response) => {
  response.sendFile('new.html', {root: './public'});
});



// REVIEW: POST route needs to parse the body passed in with the request. express.urlencoded() attaches "middleware" to do that
app.post('/articles', bodyParser, function (request, response) {
  // REVIEW: This route will receive a new article from the form page, new.html, and log that form data to the console. We will wire this up soon to actually write a record to our persistence layer!
  console.log(request.body);
  response.send(request.body);
});

app.use((req, res) => {
  res.status(404).send('Sorry, that route does not exist.');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});

