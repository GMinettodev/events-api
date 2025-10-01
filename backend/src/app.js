const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();
const helmet = require('helmet');

// Middlewares (global)
app.use(cors());
app.use(express.json());
app.use(helmet());

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/protected', dashboardRoutes);

module.exports = app;
