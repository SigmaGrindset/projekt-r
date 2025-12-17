const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
require("dotenv").config()
const morgan = require("morgan")
const { testConnection } = require('./config/db');



app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"))

app.use(session({
  secret: 'nasumicni-sigurni-string',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  },
  user: null
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const userRouter = require('./routes/user.routes.js');
app.use('/user', userRouter);

app.get('/', (req, res) => {
  return res.redirect('/user');
});

app.get("/db-test", async (req, res) => {
  const code = await testConnection(req, res)
  const msg = parseInt(code) === 200 ? "Success" : "Fail"
  return res.status(parseInt(code)).json({ msg })
})


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
