require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const Person = require('./models/person');
const morgan = require('morgan');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url  :response-time ms :body'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  let person = people.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  people = people.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = people.length > 0 ? Math.max(...people.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }
  const personFound = people.find((p) => p.name == body.name);

  if (personFound) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  people = people.concat(person);

  response.json(person);
});

app.get('/info', (req, res) => {
  const count = people.length;
  const date = new Date().toString();
  res.send(`<p>phonebook has info for ${count} people</p><p>${date}</p>`);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
