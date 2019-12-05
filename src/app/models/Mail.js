import Sequelize, { Model } from 'sequelize';

class Mail extends Model {
  static init(sequelize) {
    super.init(
      {
        from: Sequelize.STRING,
        to: Sequelize.STRING,
        subject: Sequelize.STRING,
        text: Sequelize.STRING,
        external: Sequelize.BOOLEAN
      },
      {
        sequelize,
      },
    );
    return this;
  }
}

export default Mail;
