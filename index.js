const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
let persons = [
  {
    id: 1,
    name: "farhan",
    number: "12233412",
  },
  {
    id: 2,
    name: "testname",
    number: "111111",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const currentDate = new Date();
  let info = "<p>Phonebook has info for " + persons.length + " people</p>";
  info += "<p>" + currentDate.toString() + "</p>";

  res.send(info);
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((i) => i.id === Number(req.params.id));
  if (person) {
    res.send(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  res.status(200).end();
});

app.post("/api/persons", (req, res) => {
  let person = req.body;
  let personExists = persons.find((p) => p.number === person.number);

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: "content missing",
    });
  } else if (personExists) {
    return res.status(409).json({
      error: "Person number already exists",
    });
  }
  person.id = getRandomNumber(1000, 10000);
  persons.push(person);
  console.log(persons);

  return res.json(person);
});

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const PORT = process.env.PORT || 3001;

app.listen(PORT);
