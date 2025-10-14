const express = require('express');
const cors = require('cors');
// const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
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
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/protected', dashboardRoutes);
// app.use('/admin', adminRoutes);

module.exports = app;
