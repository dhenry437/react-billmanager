require("dotenv-flow").config();

console.log(`CLIENT_CORS_ORIGIN = ${process.env.CLIENT_CORS_ORIGIN}`);

const express = require("express");
const cors = require("cors");
var compression = require("compression");
var helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_CORS_ORIGIN,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  })
);

const db = require("./db");
const { getCalendarEvents } = require("./controllers/calendar.controller.js");
db.sequelize.sync();
// db.sequelize.sync({ force: true })

app.use(express.json()); // Used to parse JSON bodies
app.use(compression()); //Compress all routes
app.use(helmet());

// Enable sessions
// TODO Redis store
app.use(
  session({
    store: new pgSession({
      conString: process.env.DATABASE_URL,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./passport.js"); // Passport.js config

app.use("/api", require("./routes/index.route"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/user.route"));
app.use("/api/events", require("./routes/event.route"));
app.use("/api/calendar", require("./routes/calendar.route"));

app.listen(process.env.HTTP_PORT, () => {
  console.log(`Listening on port ${process.env.HTTP_PORT}`);
});
