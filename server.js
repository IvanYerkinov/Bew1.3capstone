require('dotenv').config();
const exphbs  = require('express-handlebars');
const express = require('express')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const port = 3000

const app = express();

var cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(expressValidator());

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }
  console.log("Checked")

  next();
};

app.use(checkAuth);


require('./data/capstonedb');
require('./controllers/auth.js')(app);
require('./controllers/image.js')(app);

// Use "main" as our default layout
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// Use handlebars to render
app.set('view engine', 'handlebars');

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;
