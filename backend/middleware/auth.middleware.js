const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(403).send();
};

module.exports = { ensureAuthenticated };
