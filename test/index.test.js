const test = require('tape');
import '../src/database';
import UserController from '../src/app/controllers/UserController';

/**
 * Testes de Usuario
 * Criacao, atualizacao, login, etc
  */

test('Criacao, atualizacao e remocao de usuario', async (t) => {
  const before = await UserController.getUsers().length;

  const toTest = {
    name: "Gabriel Santo",
    email: "gabriel.espiritosanto@gmail.com",
    password: "12345667"
  }

  const added = await UserController.createUser(toTest);
  if(added.hasOwnProperty('error')) {
    t.assert(true != true, "Erro ao criar usuario");
  }
  const after = await UserController.getUsers().length;
  t.assert(before === after, "Criou usuario com sucesso");
  t.assert(toTest.name === added.name, "Nome correto");
  t.assert(totest.email === assert.email, "Email correto");

  t.end();
});
