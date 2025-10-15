const express = require('express');
const cors = require('cors');
// const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); // caminho para o arquivo criado acima


// Middlewares (global)
app.use(cors());
app.use(express.json());
app.use(helmet());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/events', eventRoutes);
app.use('/protected', dashboardRoutes);
// app.use('/admin', adminRoutes);

module.exports = app;
