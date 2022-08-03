const express = require('express');
require('express-async-errors');
// const fs = require('fs').promises;

// const generateToken = require('./generateToken');
const crypto = require('crypto');
const middleware = require('./utils/Middleware');
const { validateEmail, validatePassword } = require('./utils/Middleware');
const { insertPerson, verifyAuthorization, validateName, validateAge, validateTalk,
  validateWatchedAt, validateRate } = require('./utils/Talker');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/talker', async (_req, res, next) => {
  const persons = await middleware.getPersons();
  res.status(HTTP_OK_STATUS).json(persons);
  next();
});

app.get('/talker/:id', async (req, res, next) => {
  const { id } = req.params;
  const person = await middleware.getPersonId(id);
  res.status(HTTP_OK_STATUS).json(person);
  next();
});

// Este tratamento de erro funciona para a rota talker e talker:id
app.use((err, _req, res, _next) => {
  const { message } = err;
  res.status(404).json({
    message,
  });
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(HTTP_OK_STATUS).json({
    token: `${token}`,
  });
});

// Este tratamento de erro funciona para a rota de login
app.use((err, _req, res, _next) => {
  const { message } = err;
  res.status(400).json({
    message,
  });
});

app.post('/talker', verifyAuthorization, validateName, validateAge, validateTalk,
validateWatchedAt, validateRate, async (req, res) => {
  const { name, age, talk } = req.body;
  const { watchedAt, rate } = talk;
  const persons = await middleware.getPersons();
  const id = persons.length + 1;
  const newPerson = {
    id,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };
  insertPerson(newPerson);
  res.status(201).json(newPerson);
});

// não remova esse endpoint,  e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
