const test = require('tape');
import '../src/database';
import UserController from '../src/app/controllers/UserController';

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
  await UserController.deleteUser(toTest, added.id);
  const after2 = await UserController.getUsers().length;
  t.assert(before === after2, "Deletou o usuario com sucesso");

  t.end();
});
