const fs = require('fs').promises;

const PATH = './talker.json';
const middleware = require('./Middleware');

const editPerson = async (id, requestPerson) => {
  const persons = await middleware.getPersons();
  const personsFiltered = persons.filter((person) => person.id !== id);
  const personEdited = {
    id,
    ...requestPerson,
  };
  const newPersons = [...personsFiltered, personEdited];
  await fs.writeFile(PATH, JSON.stringify(newPersons));
};

const insertPerson = async (newPerson) => {
  const persons = await middleware.getPersons();
  const newPersons = [...persons, newPerson];
  await fs.writeFile(PATH, JSON.stringify(newPersons));
};

const verifyAuthorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401)
      .json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401)
      .json({ message: 'Token inválido' }); 
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400)
      .json({ message: 'O campo "name" é obrigatório' }); 
  }
  if (name.length < 3) {
  return res.status(400)
    .json({ message: 'O "name" deve ter pelo menos 3 caracteres' }); 
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400)
      .json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) { 
    return res.status(400)
      .json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  next();
};

const validateWatchedAt = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  if (!watchedAt) {
    return res.status(400)
      .json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!dateRegex.test(watchedAt)) {
    return res.status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const validateRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!rate && rate !== 0) {
    return res.status(400)
      .json({ message: 'O campo "rate" é obrigatório' });
  }
  if (rate < 1 || rate > 5) {
    return res.status(400)
      .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = {
  insertPerson,
  verifyAuthorization,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  editPerson,
};