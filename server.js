const express = require('express');
const session = require('express-session');
const app = express();
var path = require('path');

const { testConnection } = require('./config/db');

// testConnection();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'nasumicni-sigurni-string',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const userRouter = require('./routes/user.routes.js');

app.use('/user', userRouter);

app.listen(8080);
console.log('Server is running on http://localhost:8080');
