const express = require('express');
const EventController = require('../controllers/eventController');

const router = express.Router();

// Public routes
router.get('/', EventController.getEvents);

module.exports = router;
