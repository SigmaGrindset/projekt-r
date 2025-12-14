const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/', (req, res) => {
  res.render('home', { message: null });
});


router.get('/login', (req, res) => {
  res.render('login', { message: null });
});

router.get('/register', (req, res) => {
  res.render('register', { message: null });
});

router.post('/login', async (req, res) => {
  const passwordValid = await User.validateUser(req.body)
  if (passwordValid) {
    //treba spremit podatke u useru u session
  }
  else {
    //redirect na login sa odgovarajucim errorom
  }
});

router.post('/register', async (req, res) => {
  try {
    await User.createUser(req.body);
    res.redirect('/user/login')
  } catch (error) {
    console.log(error);
    throw error;
  }
});

module.exports = router;
