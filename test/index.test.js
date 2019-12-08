const test = require('tape');
import '../src/database';
import UserController from '../src/app/controllers/UserController';
import MailController from '../src/app/controllers/MailController';

/**
 * Testes de Usuario
 * Criacao, atualizacao, login, etc
 */

test('Criacao, atualizacao e remocao de usuario', async (t) => {
  const before = await UserController.getUsers().length;
  // usuario exemplo
  const toTest = {
    name: "Gabriel Santo",
    email: "gabriel.espiritosanto@gmail.com",
    password: "12345667"
  };
  const toReadd = {
    name: "Gabriel Santo 2",
    email: "gabriel.espiritosanto@gmail.com",
    password: "12381910"
  };
  const toUpdate = {
    "name": "Joao Victor",
    "email": "gabriel.espiritosanto@gmail.com",
    "oldPassword": "12345667",
    "password": "123456",
    "confirmPassword": "123456"
  };

  // cria o usuario
  const added = await UserController.createUser(toTest);
  t.assert(added.hasOwnProperty('error') === false, "Sem erros ao criar usuario");
  const after = await UserController.getUsers().length;
  t.assert(before === after, "Usuario adicionado");
  t.assert(toTest.name === added.name, "Nome correto");
  t.assert(toTest.email === added.email, "Email correto");

  // tenta criar o mesmo usuario denovo
  // falha de proposito
  const readd = await UserController.createUser(toTest);
  t.assert(readd.hasOwnProperty('error') === true, "Nao aceita criar o mesmo usuario");
  const readd2 = await UserController.createUser(toReadd);
  t.assert(readd2.hasOwnProperty('error') === true, "Nao aceita criar usuario com mesmo email");

  // atualiza usuario
  const added2 = await UserController.updateUser(toUpdate, added.id);
  t.assert(added2.hasOwnProperty('error') === false, "Sem erros ao atualizar");
  const updUser = await UserController.getUsers();
  updUser.forEach(k => {
    if(updUser.id === added.id) {
      t.assert(added2.name === updUser.name, "Nome atualizado");
    }
  })

  // tenta atualizar com senha incorreta
  const update = await UserController.updateUser(toUpdate, added.id);
  t.assert(update.hasOwnProperty('error') === true, "Nao aceita senha incorreta");

  // deleta o usuario
  const hasDeleted = await UserController.deleteUser(toUpdate, added.id);
  const after2 = await UserController.getUsers().length;
  t.assert(hasDeleted.hasOwnProperty('error') === false, "Sem erros ao deletar");
  t.assert(before === after2, "Usuario removido");

  t.end();
});


test('Envio de emails', async (t) => {
  const user1 = {
    name: "User 1",
    email: "user1tp2@meuss.com",
    password: "12345667"
  };

  const user2 = {
    name: "User 2",
    email: "user2tp2@meuss.com",
    password: "12345667"
  };

  // cria dois usuarios
  const u1 = await UserController.createUser(user1);
  const u2 = await UserController.createUser(user2);

  const mail = {
    from: u1.email,
    to: u2.email,
    subject: "Testing",
    text: "Hi i'm just testing"
  }

  // quantidades antes do envio
  const totalSentU1 = await MailController.getSender({ from: u1.email });
  const totalRecvU2 = await MailController.getReceiver({ to: u2.email });
  // enviar email interno
  const sentMail = await MailController.sendMail(mail);
  t.assert(sentMail.hasOwnProperty('error') === false, "Sem erros ao enviar");
  t.assert(sentMail.hasOwnProperty('message') === false, "Destinatario interno");
  t.assert(mail.from === sentMail.from, "Remetente correto");
  t.assert(mail.to === sentMail.to, "Destinatario correto");
  t.assert(mail.subject === sentMail.subject, "Assunto correto");
  t.assert(mail.text === sentMail.text, "Texto correto");

  // quantidades apos o envio
  const totalSentAfterU1 = await MailController.getSender({ from: u1.email });
  const totalSentAfterU2 = await MailController.getReceiver({ to: u2.email });
  t.assert(totalSentU1.length + 1 == totalSentAfterU1.length, "Quantidade enviados atualizada");
  t.assert(totalRecvU2.length + 1 == totalSentAfterU2.length, "Quantidade recebidos atualizada");

  const mail2 = {
    from: u1.email,
    to: "tp2trab@thebytefrost.com",
    subject: "Testing",
    text: "Hi i'm just testing again"
  }

  // enviar email externo
  const sentMail2 = await MailController.sendMail(mail2);
  t.assert(sentMail2.hasOwnProperty('message') === true, "Enviou externamente");

  // remove os usuarios do teste
  await UserController.deleteUser(user1, u1.id);
  await UserController.deleteUser(user2, u2.id);
  t.end();
});
