const express = require('express');
require('express-async-errors');
// const fs = require('fs').promises;

const middleware = require('./utils/Middleware');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/talker', async (req, res) => {
  try {
    const persons = await middleware.getPersons();
    return res.status(200).json(persons);
  } catch (error) {
    return res.status(500).end();
  }
});

app.get('/talker/:id', async (req, res) => {
  try {
    const persons = await getPersons.getPersons();
    return res.status(200).json(persons);
  } catch (error) {
    return res.status(500).end();
  }
});

// não remova esse endpoint,  e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
