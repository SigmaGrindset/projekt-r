
const jwt = require("jsonwebtoken")
const jwt_secret = process.env.JWT_SECRET || "secret"
console.log(jwt_secret)
// user mora biti logged in
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) return res.redirect("/user/login");

  try {
    const payload = jwt.verify(token, jwt_secret);
    req.user = payload;        // user info
    res.locals.user = payload; // za EJS
    next();
  } catch (err) {
    console.log(err)
    res.clearCookie("auth");
    return res.redirect("/user/login");
  }
}

// user ne smije biti logged in
module.exports.requireGuest = (req, res, next) => {
  const token = req.cookies.auth;
  if (token) return res.redirect("/app");
  next();
}


module.exports.populateUser = (req, res, next) => {
  const token = req.cookies.auth;
  res.locals.user = null
  if (!token) return next();

  try {
    const payload = jwt.verify(token, jwt_secret);
    req.user = payload;        // user info
    res.locals.user = payload; // za EJS
    next();
  } catch (err) {
    console.log(err)
    return;
  }
}
