const fs = require('fs').promises;

const PATH = './talker.json';

const getPersons = async () => {
  const persons = await fs.readFile(PATH, 'utf-8')
    .then((fileContent) => JSON.parse(fileContent));
  return persons;
};

const getPersonId = async (id) => {
  const persons = await getPersons();
  const person = persons.find((pessoa) => pessoa.id === id);
  return person;
};

module.exports = { getPersons, getPersonId };