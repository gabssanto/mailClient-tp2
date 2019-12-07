import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  /**
   * Action (testable) methods
   */
  async createUser(user) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(user))) {
      return { error: 'Validation fails' };
    }

    const userExists = await User.findOne({ where: { email: user.email } });

    if (userExists) {
      return { error: 'User exists' };
    }

    const { id, name, email, provider } = await User.create(user);

    return {
      id,
      name,
      email,
      provider,
    };
  }

  async updateUser(userObj, userID) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(userObj))) {
      return { error: 'Validation fails' };
    }

    const { email, oldPassword } = userObj;

    const user = await User.findByPk(userID);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return { error: 'User exists' };
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return { error: 'Password does not match' };
    }

    const { id, name, provider } = await user.update(userObj);

    return { id, name, email, provider };
  }

  async getUsers() {
    const allUsers = await User.findAll();
    return allUsers;
  }

  async deleteUser(userObj, userID) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().min(6)
    });

    if (!(await schema.isValid(userObj))) {
      return { error: 'Validation fails' };
    }

    const { email, password } = userObj;

    const user = await User.findByPk(userID);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return { error: 'User exists' };
      }
    }

    if (password && !(await user.checkPassword(password))) {
      return { error: 'Password does not match' };
    }

    const { id, name, provider } = await user.destroy();

    return { id, name, email, provider };
  }

  /**
   * Request methods
   */
  async store(req, res) {
    const answ = await this.createUser(req.body);
    if(answ.hasOwnProperty('error')) {
      return res.status(400).json(answ);
    } else {
      return res.json(answ);
    }
  }

  async update(req, res) {
    const answ = await this.updateUser(req.body, req.UserId);
    if(answ.hasOwnProperty('error')) {
      return res.status(400).json(answ);
    } else {
      return res.json(answ);
    }
  }

  async show(req, res) {
    var memama = await this.getUsers()
    return res.json(memama);
  }

  async delete(req, res) {
    const answ = await this.deleteUser(req.body, req.params.id);
    if(answ.hasOwnProperty('error')) {
      return res.status(400).json(answ);
    } else {
      return res.json(answ);
    }
  }
}

export default new UserController();
