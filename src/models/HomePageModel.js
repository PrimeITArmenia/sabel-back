const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
  headerTitle: {
    type: String,
    // required: true
  },
  headerSubtitle: {
    type: String,
    // required: true
  },
  headerImage: {
    type: String,
    // required: true
  },
  headerAuthor: {
    type: String,
    // required: true
  },
  headerText: {
    type: String,
    // required: true
  },
  footerTitle: {
    type: String,
    // required: true
  },
  footerAuthor: {
    type: String,
    // required: true
  },
  footerImage: {
    type: String,
    // required: true
  },
  footerText: {
    type: String,
    // required: true
  }
});

const HomePageModel = mongoose.model('HomePage', homePageSchema);

module.exports = HomePageModel;
