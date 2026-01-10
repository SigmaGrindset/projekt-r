const express = require('express');
const router = express.Router();
const GraphFunctions = require('../models/GraphFunctions');

router.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});

router.post('/first', async (req, res) => {
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.getStudyTimePerSubject(userID);
    /*
    return res.render('graphs', {
      message: null,
      graphData
    });
    */
    return res.json(graphData);
  } catch (err) {
    /*
    return res.render('graph', {
      message: 'Došlo je do greške pri dohvaćanju podataka za grafove.',
        graphData: null
    })
    */
   console.log(err);
   return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

router.post('/second', async (req, res) => {
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.getStudyOverTime(userID);
    /*
    return res.render('graph',{
      message: null,
      graphData
    });
    */
    return res.json(graphData);
  } catch (err) {
    /*
    return res.render({
      message: 'Došlo je do greške pri dohvaćanju podataka za grafove.',
        graphData: null
    })
    */
   console.log(err);
   return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

router.post('/third', async (req, res) => {
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.getStudyByDaysOfWeek(userID);
    /*
    return res.render('graph',{
      message: null,
      graphData
    });
    */
    return res.json(graphData);
  } catch (err) {
    /*
    return res.render({
      message: 'Došlo je do greške pri dohvaćanju podataka za grafove.',
        graphData: null
    })
    */
   console.log(err);
   return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

router.post('/fourth', async (req, res) => {
  try {
    const userID = req.body.id;
    const graphData = await GraphFunctions.getStudyByHours(userID);
    /*
    return res.render('graph',{
      message: null,
      graphData
    });
    */
    return res.json(graphData);
  } catch (err) {
    /*
    return res.render({
      message: 'Došlo je do greške pri dohvaćanju podataka za grafove.',
        graphData: null
    })
    */
   console.log(err);
   return res.status(500).json({ message: 'Došlo je do greške pri dohvaćanju podataka za grafove.' });
  }
});

module.exports = router;