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

const updateUserProfileInDb = async (userId, { name, email }) => {
  const existing = await User.findOne({
    where: {
      email,
      id: { [Sequelize.Op.ne]: userId },
    },
  });

  if (existing) {
    const error = new Error("Email is already in use");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.name = name;
  user.email = email;
  await user.save();

  return { id: user.id, name: user.name, email: user.email };
};

const updateUserPasswordInDb = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const match = await bcrypt.compare(currentPassword, user.hashedPassword);
  if (!match) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  user.hashedPassword = await bcrypt.hash(newPassword, salt);
  await user.save();

  return true;
};

module.exports = {
  createUserInDb,
  getUsersFromDb,
  updateUserProfileInDb,
  updateUserPasswordInDb,
};
