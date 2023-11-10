const express = require('express');
const router = express.Router();
const SubscriberController = require('../../controllers/subscribers');

// POST route to create a new subscriber
router.post('/create', SubscriberController.createSubscriber);

module.exports = router;
