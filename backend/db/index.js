const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.events = require("./event.model.js")(sequelize, Sequelize);

// One user has many events
db.users.hasMany(db.events, { foreignKey: "userId", as: "events" });
db.events.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

module.exports = db;
