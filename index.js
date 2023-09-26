/* eslint-disable consistent-return */
require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();
const morgan = require('morgan');
const Person = require('./models/person');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url  :response-time ms :body'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)

    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  }
  let personExist = false;
  Person.find({ name: body.name }).then(() => {
    personExist = true;
  });

  if (personExist) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get('/info', (req, res) => {
  Person.count({}).then((c) => {
    const date = new Date().toString();
    res.send(`<p>phonebook has info for ${c} people</p><p>${date}</p>`);
  });
});

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
app.use(errorHandler);

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
