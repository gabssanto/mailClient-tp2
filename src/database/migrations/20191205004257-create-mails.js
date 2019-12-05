module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('mails', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      external: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('mails');
  }
};
