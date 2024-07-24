const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
