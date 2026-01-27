const express = require("express");
const studySessionRouter = express.Router();

const { requireAuth } = require("../middleware/userMiddleware");
const StudySession = require("../models/StudySession");
const Subject = require("../models/Subject");

studySessionRouter.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const startedAt = req.query?.startedAt || null;

    const [studySessions, subjects] = await Promise.all([
      StudySession.getUserStudySessions(userId, startedAt),
      Subject.getSubjectsForUser(userId),
    ]);

    return res.render("studySessions", {
      message: null,
      formData: null,
      studySessions,
      subjects, // ✅ uvijek šaljemo
    });
  } catch (err) {
    console.log(err);
    return res.render("studySessions", {
      message: "Došlo je do greške pri dohvaćanju sesija.",
      formData: null,
      studySessions: [],
      subjects: [], // ✅ uvijek šaljemo
    });
  }
});

studySessionRouter.post("/", requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    await StudySession.createStudySession({
      startedAt: req.body.startedAt,
      endedAt: req.body.endedAt || null,
      description: req.body.description || "",
      userId,
      subjectId: req.body.subjectId,
    });

    return res.redirect("/study-session");
  } catch (err) {
    console.log(err);

    const [studySessions, subjects] = await Promise.all([
      StudySession.getUserStudySessions(userId),
      Subject.getSubjectsForUser(userId),
    ]);

    return res.render("studySessions", {
      message: "Problem pri stvaranju sessiona.",
      formData: req.body,
      studySessions,
      subjects, // ✅ uvijek šaljemo
    });
  }
});

studySessionRouter.post("/delete/:studySessionId", requireAuth, async (req, res) => {
  try {
    await StudySession.deleteStudySession(req.params.studySessionId);
    return res.redirect("/study-session");
  } catch (err) {
    console.log(err);
    return res.redirect("/study-session");
  }
});

module.exports = studySessionRouter;
