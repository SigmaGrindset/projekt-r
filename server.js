const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
require("dotenv").config();
const morgan = require("morgan");
const { testConnection } = require('./config/db');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));

app.use(session({
  secret: 'nasumicni-sigurni-string',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ✅ globalno postavi usera za sve EJS viewove
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const userRouter = require('./routes/user.routes.js');
app.use('/user', userRouter);

const subjectsRouter = require("./routes/subjects.routes");
app.use("/subjects", subjectsRouter);

const studySessionRouter = require("./routes/studySession.routes.js");
app.use("/study-session", studySessionRouter);

const planRouter = require("./routes/plan.routes");
app.use("/plan", planRouter);

const graphRouter = require("./routes/graph.routes");
app.use("/graph", graphRouter);

// ✅ entry point u aplikaciju (ovo je ruta na koju treba vodit "Uđi u app")
app.get("/app", (req, res) => {
  if (!req.session?.user) return res.redirect("/user/login");
  return res.redirect("/subjects"); // ili "/study-session" ako želiš da je to prva stranica
});

// ✅ pametni root: ako je loginan ide u app, inače na landing (/user)
app.get('/', (req, res) => {
  if (req.session?.user) return res.redirect("/app");
  return res.redirect('/user');
});

app.get("/db-test", async (req, res) => {
  const code = await testConnection(req, res);
  const msg = parseInt(code) === 200 ? "Success" : "Fail";
  return res.status(parseInt(code)).json({ msg });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
