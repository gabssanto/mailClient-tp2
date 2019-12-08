import * as Yup from 'yup';
import nodemailer from "nodemailer";
import Mail from '../models/Mail';
import User from '../models/User';

class MailController {
  /**
   * Action (testable) methods
   */

  async sendMail(data) {
    const schema = Yup.object().shape({
      from: Yup.string().email().required(),
      to: Yup.string().email().required(),
      subject: Yup.string().required(),
      text: Yup.string().required(),
      external: Yup.bool()
    });

    if (!(await schema.isValid(data))) {
      return { error: 'All fields are required to send' };
    }

    const emailSender = data.from;
    const sender = await User.findOne({ where: { email: emailSender }});

    if (!sender) {
      return { error: 'Internal Server Error: Sender not found'}
    }
    const emailReceiver = data.to;
    const receiver = await User.findOne({ where: { email: emailReceiver} });

    if (!receiver) {
      //yet to be implemented receiving and sending from another provider
      const transporter = nodemailer.createTransport({
        host: 'MAILHOST',
        port: 465,
        secure: true,
        auth: {
          user: 'MAILUSER',
          pass: 'MAILPWD'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      transporter.sendMail({
        from: data.from,
        to: data.to,
        subject: data.subject,
        text: data.text
      }, (error, info) => {
        if(error) {
          console.log(error);
          return { error };
        } else {
          console.log("Enviado: " + info.response);
          return { res: info.response };
        }
      });
      data.external = true;
      const { id, from, to, subject, text, external } = await Mail.create(data);
      return { message: 'Message sent to external receiver'};
    }

    data.external = false;

    const { id, from, to, subject, text, external } = await Mail.create(data);

    return { id, from, to, subject, text, external }
  }

  async getSender(data) {
    const schema = Yup.object().shape({
      from: Yup.string().email().required(),
    });

    if (!(await schema.isValid(data))) {
      return { error: 'All fields are required to send' };
    }

    const emailSender = data.from;

    const user = await User.findOne({ where: { email: emailSender }});

    const ret = await Mail.findAll({
      where: {
        from: user.email
      }
    });

    return ret;
  }

  async getReceiver(data) {
    const schema = Yup.object().shape({
      to: Yup.string().email().required(),
    });

    if (!(await schema.isValid(data))) {
      return { error: 'All fields are required to send' };
    }

    const emailReceiver = data.to;

    const user = await User.findOne({ where: { email: emailReceiver }});

    const ret = await Mail.findAll({
      where: {
        to: user.email
      }
    });

    return ret;
  }

  /**
   * Request methods
   */
  async store(req, res) {
    /*const schema = Yup.object().shape({
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

    return res.json({ id, from, to, subject, text, external })*/
    const ret = await this.sendMail(req.body);
    if(ret.hasOwnProperty('error')) {
      return res.status(400).json(ret);
    } else {
      return res.json(ret);
    }
  }

  async showSender(req, res) {
    /*const schema = Yup.object().shape({
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

    return res.json(ret)*/
    const ret = await this.getSender(req.body);
    if(ret.hasOwnProperty('error')) {
      return res.status(400).json(ret);
    } else {
      return res.json(ret);
    }
  }

  async showReceiver(req, res) {
    /*const schema = Yup.object().shape({
      to: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'All fields are required to send' });
    }

    const emailReceiver = req.body.to;

    const user = await User.findOne({ where: { email: emailReceiver }});

    const ret = await Mail.findAll({
      where: {
        to: user.email
      }
    });

    return res.json(ret)*/
    const ret = await this.getReceiver(req.body);
    if(ret.hasOwnProperty('error')) {
      return res.status(400).json(ret);
    } else {
      return res.json(ret);
    }
  }
};

export default new MailController();
