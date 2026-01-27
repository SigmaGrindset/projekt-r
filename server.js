const express = require('express');
const app = express();
const path = require('path');
require("dotenv").config();
const morgan = require("morgan");
const { testConnection } = require('./config/db');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const userRouter = require('./routes/user.routes.js');
const { populateUser } = require('./middleware/userMiddleware.js');
app.use(populateUser)
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
  if (!req.user) {
    return res.redirect("/")
  }
  return res.redirect("/subjects"); // ili "/study-session" ako želiš da je to prva stranica
});

// ✅ pametni root: ako je loginan ide u app, inače na landing (/user)
app.get('/', (req, res) => {
  return res.redirect('/app');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
