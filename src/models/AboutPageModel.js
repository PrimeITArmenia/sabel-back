const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema({
  content: {
    type: String
  }
});

const AboutPageModel = mongoose.model('AboutPage', aboutPageSchema);

module.exports = AboutPageModel;
