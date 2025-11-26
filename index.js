const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const Models = require('./models.js');
const Movies = Models.Movie;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('common'));

// Connect to MongoDB (replace with your connection string)
mongoose.connect(process.env.CONNECTION_URI || 'mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ✅ Movies endpoint (temporarily without authentication)
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => res.status(200).json(movies))
        .catch((err) => res.status(500).send('Error: ' + err));
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to myFlix API!');
});

// Listen on port
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
