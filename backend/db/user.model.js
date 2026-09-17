module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    hashedPassword: { type: Sequelize.STRING, allowNull: false },
    preferences: {
      type: Sequelize.JSON,
      defaultValue: {
        currency: "AUD",
        weekStartsOn: 1,
        dateFormat: "dd/MM/yyyy",
        bufferType: "none",
        bufferValue: 0,
      },
    },
  });
  return User;
};
