const { CommentModel, ArticleModel } = require('../models/index');
const jwt_decode = require('jwt-decode');

const getAllComments = async (req, res, next) => {
	const { articleId } = req.params;
    console.log('articleId', articleId)
    try {
        const comments = await CommentModel.find({ articleId: articleId }).populate('userId', 'name');
                 
        res.json(comments);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
}

const createComment = async (req, res, next) => {
  const { content, articleId } = req.body;
  const token = req.headers.authorization;
  const userId = jwt_decode(token).sub;

  try {
    const article = await ArticleModel.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    const newComment = new CommentModel({content, userId, articleId});
    const savedComment = await newComment.save();

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
        articleId,
        { $push: { comments: savedComment._id } },
        { new: true, useFindAndModify: false }
    );
    
    res.status(201).json({ savedComment, updatedArticle });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
}

const updateComment = async (req, res, next) => {
	try {
    const { commentId } = req.params;
    const { content } = req.body;
    const token = req.headers.authorization;
    const userId = jwt_decode(token).sub;

    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to update this comment.' });
    }

    comment.content = content;
    const updatedComment = await comment.save();

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const removeComment = async (req, res, next) => {
	const { commentId } = req.params;
  const token = req.headers.authorization;
  const decoted = jwt_decode(token);
  
  try {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.userId.toString() !== decoted.sub && decoted.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to delete this comment.' });
    }
    const deletedComment = await CommentModel.findByIdAndRemove(commentId);

    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const updatedArticle = await ArticleModel.updateOne(
      { comments: commentId },
      { $pull: { comments: commentId } }
    );

    res.json({ message: 'Comment deleted successfully', deletedComment, updatedArticle });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
	  getAllComments,
    createComment,
    updateComment,
    removeComment,
};