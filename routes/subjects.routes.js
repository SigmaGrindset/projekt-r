const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { requireAuth } = require("../middleware/userMiddleware");

router.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});


router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id; 
    const subjects = await Subject.getSubjectsForUser(userId);

    return res.render('subjects', { 
      message: null, 
      formData: null, 
      subjects 
    });
  } catch (err) {
    return res.render('subjects', {
      message: 'Došlo je do greške pri dohvaćanju predmeta.',
      formData: null,
      subjects: []
    });
  }
});

//ZA DODAVANJE PREDMETA
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    await Subject.createSubject(userId, req.body);

    const subjects = await Subject.getSubjectsForUser(userId);
    return res.render('subjects', {
      message: 'Predmet je dodan.',
      formData: null,
      subjects
    });
  } catch (err) {
    const userId = req.session.user.id;
    const subjects = await Subject.getSubjectsForUser(userId);

    return res.render('subjects', {
      message: err.message || 'Neispravan unos.',
      formData: { name: req.body.name },
      subjects
    });
  }
});


router.post('/delete/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const subjectId = req.params.id;

    const check = await Subject.deleteSubject(userId, subjectId);
    if (!check) {
      const subjects = await Subject.getSubjectsForUser(userId);
      return res.render('subjects', {
        message: 'Predmet ne postoji.',
        formData: null,
        subjects
      });
    }

    return res.redirect('/subjects');
  } catch (err) {
    return res.render('subjects', {
      message: 'Došlo je do greške pri brisanju predmeta.',
      formData: null,
      subjects: []
    });
  }
});


module.exports = router;
