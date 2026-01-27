const express = require('express');
const router = express.Router();
const { requireAuth } = require("../middleware/userMiddleware");
const GraphFunctions = require('../models/GraphFunctions');


// Graf 1: Vrijeme učenja po predmetu
router.post('/first', requireAuth, async (req, res) => {
  console.log(req.user)
  console.log(res.locals.user)
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.getStudyTimePerSubject(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

// Graf 2: Učenje kroz vrijeme
router.post('/second', requireAuth, async (req, res) => {
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.getStudyOverTime(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

// Graf 3: Učenje po danima u tjednu
router.post('/third', requireAuth, async (req, res) => {
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.getStudyByDaysOfWeek(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

// Graf 4: Učenje po satima
router.post('/fourth', requireAuth, async (req, res) => {
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.getStudyByHours(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

router.post('/fifth', requireAuth, async (req, res) => {
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.githubActivity(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

router.post('/sixth', requireAuth, async (req, res) => {
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.plannedVsActualStudy(userID);
    return res.json(graphData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

// GET ruta za prikaz stranice s grafovima
router.get("/", requireAuth, (req, res) => {
  res.render("graphs", { user: req.user });
});

module.exports = router;
