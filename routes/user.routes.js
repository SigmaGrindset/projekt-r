const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

const User = require('../models/User');
const { requireAuth, requireGuest } = require("../middleware/userMiddleware");

router.get('/', (req, res) => {
  res.render('home', { message: null });
});

router.get('/login', requireGuest, (req, res) => {
  res.render('login', { message: null, formData: null });
});

router.get('/register', requireGuest, (req, res) => {
  res.render('register', { message: null, formData: null });
});

router.post("/logout", requireAuth, (req, res) => {
  req.session.user = null;
  return res.redirect("/user");
});

router.get("/logout", requireAuth, (req, res) => {
  req.session.user = null;
  return res.redirect("/user");
});

router.post('/login', requireGuest, async (req, res) => {
  try {
    const user = await User.validateUser(req.body); // { username } ili null

    if (!user) {
      return res.status(401).render('login', {
        message: 'Neispravno korisničko ime ili lozinka.',
        formData: { username: req.body.username }
      });
    }

    req.session.user = user;
    return res.redirect("/user");
  } catch (err) {
    return res.status(500).render('login', {
      message: 'Došlo je do greške. Pokušaj ponovno.',
      formData: { username: req.body.username }
    });
  }
});

router.post('/register', requireGuest, async (req, res) => {
  try {
    if (req.body.password !== req.body.confirm) {
      return res.status(400).render('register', {
        message: 'Lozinke nisu iste.',
        formData: { username: req.body.username, email: req.body.email }
      });
    }

    await User.createUser(req.body);
    return res.redirect('/user/login');
  } catch (error) {
    return res.status(400).render('register', {
      message: error.message,
      formData: { username: req.body.username, email: req.body.email }
    });
  }
});

module.exports = router;
