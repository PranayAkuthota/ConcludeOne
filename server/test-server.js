const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({path: './.env'});
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/conclude_one")
  .then(() => console.log('MongoDB connected for test server'))
  .catch(err => console.log(err));

app.use('/api', require('./routes/apiRoutes'));

app.listen(3006, () => console.log('Test Server running on port 3006'));
