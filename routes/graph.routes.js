const express = require('express');
const router = express.Router();
const { requireAuth } = require("../middleware/userMiddleware");
const GraphFunctions = require('../models/GraphFunctions');

// Middleware za pristup useru
router.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

// Graf 1: Vrijeme učenja po predmetu
router.post('/first', async (req, res) => {
  try {
    const userID = req.session.user.id;
    const graphData = await GraphFunctions.getStudyTimePerSubject(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

// Graf 2: Učenje kroz vrijeme
router.post('/second', async (req, res) => {
  try {
    const userID = req.session.user.id;
    const graphData = await GraphFunctions.getStudyOverTime(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

// Graf 3: Učenje po danima u tjednu
router.post('/third', async (req, res) => {
  try {
    const userID = req.session.user.id;
    const graphData = await GraphFunctions.getStudyByDaysOfWeek(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

// Graf 4: Učenje po satima
router.post('/fourth', async (req, res) => {
  try {
    const userID = req.session.user.id;
    const graphData = await GraphFunctions.getStudyByHours(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

// GET ruta za prikaz stranice s grafovima
router.get("/", requireAuth, (req, res) => {
  res.render("graphs",{ user: req.session.user});
});

module.exports = router;
