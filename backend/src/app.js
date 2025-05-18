const express = require('express');
const cors = require('cors');
const teamRoutes = require('./routes/team.routes');
const matchRoutes = require('./routes/match.routes');
const stadiumRoutes = require('./routes/stadium.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/stadiums', stadiumRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ekstraklasa API' });
});

module.exports = app;