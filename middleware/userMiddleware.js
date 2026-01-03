
// user mora biti logged in
module.exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/user/login")
  } else {
    next()
  }
}

// user ne smije biti logged in
module.exports.requireGuest = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/")
  } else {
    next()
  }
}
