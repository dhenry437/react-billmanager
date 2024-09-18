var passport = require("passport");

const getAuthenticatedUser = (req, res) => {
  res.send({ user: req.user });
};

const signInPassport = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.status(500).send({
        info: info,
        error: err,
        alert: { type: "danger", message: "Sign in failed, server error" },
      });
    }
    if (!user) {
      return res.status(403).send({
        alert: { type: "danger", message: info.message },
      });
    }

    // NEED TO CALL req.login()!!!
    req.login(user, err => {
      if (err) {
        return res.status(500).send({
          info: info,
          error: err,
          alert: { type: "danger", message: "Sign in failed, server error" },
        });
      }

      // ? Don't send hashedPassword
      // Can only do this because of `raw: true` in the sequelize query
      // in the passport strategy definition (passport.js file)
      const { hashedPassword, ...tmpUser } = user;

      return res.send({
        user: tmpUser,
        alert: { type: "success", message: "Sign in success" },
      });
    });
  })(req, res, next);
};
const signOutPassport = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).send({
        error: err,
        alert: { type: "danger", message: "Sign out failed, server error" },
      });
    }
    return res.send({
      alert: { type: "success", message: "Sign out success" },
    });
  });
};

module.exports = {
  getAuthenticatedUser,
  signInPassport,
  signOutPassport,
};
