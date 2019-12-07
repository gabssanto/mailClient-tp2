import * as Yup from 'yup';
import nodemailer from "nodemailer";
import Mail from '../models/Mail';
import User from '../models/User';

class MailController {
  async store(req, res) {
    const schema = Yup.object().shape({
      from: Yup.string().email().required(),
      to: Yup.string().email().required(),
      subject: Yup.string().required(),
      text: Yup.string().required(),
      external: Yup.bool()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'All fields are required to send' });
    }

    const emailSender = req.body.from;
    const sender = await User.findOne({ where: { email: emailSender }});

    if (!sender) {
      return res.status(400).json(
        { error: 'Internal Server Error: Sender not found'}
      );
    }
    const emailReceiver = req.body.to;
    const receiver = await User.findOne({ where: { email: emailReceiver} });

    if (!receiver) {
      //yet to be implemented receiving and sending from another provider
      return res.json({ message: 'This is an external receiver, not implemented yet'});
    }

    req.body.external = false;

    const { id, from, to, subject, text, external } = await Mail.create(req.body);


    return res.json({ id, from, to, subject, text, external })
  }

  async showSender(req, res) {
    const schema = Yup.object().shape({
      from: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'All fields are required to send' });
    }

    const emailSender = req.body.from;

    const user = await User.findOne({ where: { email: emailSender }});

    const ret = await Mail.findAll({
      where: {
        from: user.email
      }
    });

    return res.json(ret)
  }

};

export default new MailController();
