const express = require('express');
const router = express.Router();

const CalendarItem = require('../models/CalendarItem');
const Subject = require('../models/Subject');
const { requireAuth } = require("../middleware/userMiddleware");

router.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

// dohvacanje plana za datum /plan?date=YYYY-MM-DD
router.get('/', requireAuth, async (req, res) => {
  try {
    const userID = req.session.user.id;

    const date = req.query.date || new Date().toISOString().slice(0, 10);

    const subjects = await Subject.getSubjectsForUser(userID);
    const items = await CalendarItem.getPlanForDate(userID, date);

    return res.render('plan', {
      message: null,
      formData: { date }, 
      date,
      subjects,
      items
    });
  } catch (err) {
    return res.render('plan', {
      message: 'Došlo je do greške pri dohvaćanju plana.',
      formData: null,
      date: req.query.date || new Date().toISOString().slice(0, 10),
      subjects: [],
      items: []
    });
  }
});

// dodavanje plan itema
router.post('/', requireAuth, async (req, res) => {
  try {
    const userID = req.session.user.id;

    await CalendarItem.createPlanItem(userID, req.body);

    const date = req.body.date;
    const subjects = await Subject.getSubjectsForUser(userID);
    const items = await CalendarItem.getPlanForDate(userID, date);

    return res.render('plan', {
      message: 'Plan je dodan.',
      formData: null,
      date,
      subjects,
      items
    });
  } catch (err) {
    const userID = req.session.user.id;
    const date = req.body.date || new Date().toISOString().slice(0, 10);

    const subjects = await Subject.getSubjectsForUser(userID);
    const items = await CalendarItem.getPlanForDate(userID, date);

    return res.render('plan', {
      message: err.message || 'Neispravan unos.',
      formData: {
        date,
        subject_id: req.body.subject_id,
        planned_minutes: req.body.planned_minutes,
        description: req.body.description
      },
      date,
      subjects,
      items
    });
  }
});

// BRISANJE PLANA
router.post('/delete/:id', requireAuth, async (req, res) => {
  try {
    const userID = req.session.user.id;
    const itemID = req.params.id;

    const date = req.body.date || new Date().toISOString().slice(0, 10);

    const check = await CalendarItem.deletePlanItem(userID, itemID);
    const subjects = await Subject.getSubjectsForUser(userID);
    const items = await CalendarItem.getPlanForDate(userID, date);

    if (!check) {
      return res.render('plan', {
        message: 'Plan stavka ne postoji.',
        formData: null,
        date,
        subjects,
        items
      });
    }

    return res.render('plan', {
      message: 'Plan je obrisan.',
      formData: null,
      date,
      subjects,
      items
    });
  } catch (err) {
    return res.render('plan', {
      message: 'Došlo je do greške pri brisanju plana.',
      formData: null,
      date: req.body.date || new Date().toISOString().slice(0, 10),
      subjects: [],
      items: []
    });
  }
});


//PROMJENA PLANA
router.post('/update/:id', requireAuth, async (req, res) => {
  try {
    const userID = req.session.user.id;
    const itemID = req.params.id;

    const date = req.body.date || new Date().toISOString().slice(0, 10);

    const updated = await CalendarItem.updatePlanItem(userID, itemID, req.body);

    const subjects = await Subject.getSubjectsForUser(userID);
    const items = await CalendarItem.getPlanForDate(userID, date);

    if (!updated) {
      return res.render('plan', {
        message: 'Plan stavke ne postoji.',
        formData: null,
        date,
        subjects,
        items
      });
    }

    return res.render('plan', {
      message: 'Plan je ažuriran.',
      formData: null,
      date,
      subjects,
      items
    });
  } catch (err) {
    const userID = req.session.user.id;
    const date = req.body.date || new Date().toISOString().slice(0, 10);

    const subjects = await Subject.getSubjectsForUser(userID);
    const items = await CalendarItem.getPlanForDate(userID, date);

    return res.render('plan', {
      message: err.message || 'Došlo je do greške pri ažuriranju plana.',
      formData: req.body,
      date,
      subjects,
      items
    });
  }
});


module.exports = router;
