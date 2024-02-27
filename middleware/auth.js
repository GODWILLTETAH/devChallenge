const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const token =
    req.cookies.jwt ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect("/home");
      } else {
        req.user = decodedToken;
        
        next();
      }
    });
  } else {
    res.redirect("/home");
  }
};

module.exports = {
  ensureAuthenticated,
};
