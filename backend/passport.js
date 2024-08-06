var passport = require("passport");
var LocalStrategy = require("passport-local");
var bcrypt = require("bcrypt");

const db = require("./db");
const Sequelize = db.Sequelize;
const User = db.users;

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function verify(
    email,
    password,
    done
  ) {
    try {
      // Find user with matching email
      const user = await User.findOne({
        attributes: ["id", "name", "email", "hashedPassword"],
        where: { email },
        raw: true,
      });
      if (!user)
        return done(null, false, { message: "Incorrect username or password" });

      // Check password matches hashed password
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (!match)
        return done(null, false, { message: "Incorrect username or password" });

      return done(null, user);
    } catch {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id, { attributes: ["id", "name", "email"] }).then(function (
    user
  ) {
    done(null, user);
  });
});
