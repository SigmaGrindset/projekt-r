
const express = require("express")

const studySessionRouter = express.Router()
const { requireAuth } = require("../middleware/userMiddleware");
const StudySession = require("../models/StudySession")

studySessionRouter.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  next();
});


studySessionRouter.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id
    const studySessions = await StudySession.getUserStudySessions(userId, req.body?.startedAt)
    return res.render("studySessions", {
      message: null,
      formData: null,
      studySessions
    })
    // return res.json({ studySessions })
  } catch (err) {
    console.log(err)
    return res.render("studySessions", {
      message: "Došlo je do greške pri dohvaćanju sesija.",
      formData: null,
      studySessions: []
    })
    // return res.status(500).json({ error: err })
  }
})

studySessionRouter.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id
    await StudySession.createStudySession({
      startedAt: req.body.startedAt,
      endedAt: req.body.endedAt,
      description: req.body.description,
      userId: userId,
      subjectId: req.body.subjectId,
    })
    const studySessions = await StudySession.getUserStudySessions(userId)
    return res.render("studySessions", {
      message: "Study session je dodan.",
      formData: null,
      studySessions
    })
    // return res.status(200).json({ message: "uspjesno dodan study session" })
  } catch (err) {
    console.log(err)
    const userId = req.session.user.id
    const studySessions = await StudySession.getUserStudySessions(userId)
    return res.render("studySessions", {
      message: "Problem pri stvaranju sessiona.",
      formData: null,
      studySessions
    })
    // return res.status(500).json({ error: err })
  }
})

studySessionRouter.post("/delete/:studySessionId", requireAuth, async (req, res) => {
  try {
    await StudySession.deleteStudySession(req.params.studySessionId)
    return res.redirect("/study-session")
    // return res.status(200).json({ message: "uspjesno izbrisan study session" })
  } catch (err) {
    console.log(err)
    return res.render("studySessions", {
      message: "Problem pri stvaranju sessiona.",
      formData: null,
      studySessions: []
    })

    // return res.status(500).json({ error: err })
  }
})


module.exports = studySessionRouter
