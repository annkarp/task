const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tasksRoute = require('./routes/tasks');
require('./kafka');
require('./kafka/consumer');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());

app.listen(PORT,() => {
  console.log(`app listening in port ${PORT}`)
})

app.use('/tasks', tasksRoute);

app.use('*', (req, res) => {
  res.status(404).send('route not found');
})
