const SubscriberModel = require('../models/SubscriberModel');

createSubscriber = async (req, res) => {
	try {
	  const { email } = req.body;
	  
	  // Check if the email already exists
	  const existingSubscriber = await SubscriberModel.findOne({ email });
	  
	  if (existingSubscriber) {
		return res.status(400).json({ message: 'Subscriber already exists' });
	  }
	  
	  // Create a new subscriber
	  const subscriber = new SubscriberModel({ email });
	  
	  await subscriber.save();
	  
	  return res.status(201).json(subscriber);
	} catch (error) {
	  console.error(error);
	  return res.status(500).json({ message: 'Internal Server Error' });
	}
  };

  module.exports = {
	createSubscriber
};