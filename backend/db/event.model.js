module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define("Event", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    amount: { type: Sequelize.FLOAT },
    description: { type: Sequelize.STRING },
    date: { type: Sequelize.STRING, allowNull: false },
    type: { type: Sequelize.STRING, allowNull: false },
    rruleString: { type: Sequelize.STRING },
    reactState: { type: Sequelize.JSON, allowNull: false },
  });
  return Event;
};
