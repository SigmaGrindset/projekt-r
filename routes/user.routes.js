const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireGuest } = require("../middleware/userMiddleware")

router.get('/', (req, res) => {
  res.render('home', { message: null });
});


router.get('/login', requireGuest, (req, res) => {
  res.render('login', { message: null });
});

router.get('/register', requireGuest, (req, res) => {
  res.render('register', { message: null });
});

router.get("/logout", requireAuth, (req, res) => {
  req.session.user = null
  return res.redirect("/user")
})

router.post('/login', requireGuest, async (req, res) => {
  console.log(req.body)
  try {
    const passwordValid = await User.validateUser(req.body)
    if (passwordValid) {
      req.session.user = req.body.user
      return res.redirect("/user")
      // return res.status(200).json({ msg: "Success" })
    }
    else {
      return res.status(200).json({ error: "Invalid credentials" })
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
});

router.post('/register', requireGuest, async (req, res) => {
  console.log(req.body)
  try {
    await User.createUser(req.body);
    return res.redirect('/user/login')
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message })
  }
});

module.exports = router;
