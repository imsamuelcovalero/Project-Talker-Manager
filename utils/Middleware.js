const fs = require('fs').promises;

const PATH = './talker.json';

const getPersons = async () => {
  let persons = await fs.readFile(PATH, 'utf-8')
    .then((fileContent) => JSON.parse(fileContent));
  if (!persons) persons = []; 
  return persons;
};

const getPersonId = async (id) => {
  const persons = await getPersons();
  const person = persons.find((pessoa) => pessoa.id === Number(id));
  if (!person) throw new Error('Pessoa palestrante não encontrada');
  return person;
};

const validateEmail = (req, _res, next) => {
  const { email } = req.body;
  const emailFormat = /[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z.]*\w$/;

  if (!email) throw new Error('O campo "email" é obrigatório');
  if (!emailFormat.test(email)) throw new Error('O "email" deve ter o formato "email@email.com"');

  next();
};

const validatePassword = (req, _res, next) => {
  const { password } = req.body;

  if (!password) throw new Error('O campo "password" é obrigatório');
  if (password.length < 6) throw new Error('O "password" deve ter pelo menos 6 caracteres');

  next();
};

module.exports = { getPersons, getPersonId, validateEmail, validatePassword };