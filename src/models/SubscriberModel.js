const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Other fields you want to save
});

const SubscriberModel = mongoose.model('Subscriber', subscriberSchema);

module.exports = SubscriberModel;