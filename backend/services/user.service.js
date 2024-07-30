const db = require("../db");
const Sequelize = db.Sequelize;
const User = db.users;

const bcrypt = require("bcrypt");

const createUserInDb = async user => {
  const { name, email, password } = user;

  // Hash password with salt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await User.create({ name, email, hashedPassword });
};

// search is an object of form
// {
//   id: string|null
//   email: string|null
// }
const getUsersFromDb = async search => {
  const users = await User.findAll({
    attributes: ["id", "name", "email"],
    where: search,
  });

  return users;
};

module.exports = { createUserInDb, getUsersFromDb };
