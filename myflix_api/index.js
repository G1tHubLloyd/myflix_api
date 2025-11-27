const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('common'));

// ✅ Connect to MongoDB Atlas via Heroku config var
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// ✅ User routes
// Create new user
app.post('/users', async (req, res) => {
    try {
        const newUser = await Users.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all users (without passwords)
app.get('/users', async (req, res) => {
    try {
        const users = await Users.find().select('-Password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a user (change username, email, password, birthday)
app.put('/users/:id', async (req, res) => {
    try {
        const updates = req.body;
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-Password'); // don't return password
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a Movie to a User’s Favorites
app.post('/users/:id/movies/:movieId', async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            { $push: { FavoriteMovies: req.params.movieId } },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Alias: accept POST /:userId/movies/:movieId (some clients use this shorter shape)
app.post('/:userId/movies/:movieId', async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(
            req.params.userId,
            { $push: { FavoriteMovies: req.params.movieId } },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Alias: allow POST /:userId/movies/:movieId -> add favorite
app.post('/:userId/movies/:movieId', async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(
            req.params.userId,
            { $push: { FavoriteMovies: req.params.movieId } },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Movie routes
// Get all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movies.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new movie
app.post('/movies', async (req, res) => {
    try {
        const movie = await Movies.create(req.body);
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single movie by ID
app.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movies.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a user (simple update, excludes returning Password)
app.put('/users/:id', async (req, res) => {
    try {
        const updates = req.body;
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-Password');

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const resp = user.toObject ? user.toObject() : user;
        if (resp.Password) delete resp.Password;
        res.json({ message: 'User deleted', user: resp });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to myFlix API!');
});

// Listen on port (Heroku provides PORT)
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
