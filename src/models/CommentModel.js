const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    articleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Article', 
        required: true 
    },
  },
  {
    timestamps: true,
  },
);
  
  const CommentMode = mongoose.model('Comment', commentSchema);
  
  module.exports = CommentMode;