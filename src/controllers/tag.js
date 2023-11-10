const { TagModel, ArticleModel } = require('../models/index');

const getAllTags = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = process.env.perPage || 5;

  try {
    const totalCount = await TagModel.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    const tags = await TagModel.find()
      .select('name description')
      .skip(perPage * (page - 1))
      .limit(perPage);

    res.json({
        tags,
        page,
        totalPages,
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const createTag = async (req, res, next) => {
  try {
      const { name, description } = req.body;
      const newTag = new TagModel({ name, description });
      const createdTag = await newTag.save();
  
      res.status(201).json(createdTag);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
}

const updateTag = async (req, res, next) => {
	try {
    const { tagId } = req.params;
    const { name, description } = req.body;

    const updatedTag = await TagModel.findByIdAndUpdate(tagId, { name, description }, { new: true });

    if (!updatedTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const removeTag = async (req, res, next) => {
	try {
    const { tagId } = req.params;
    
    const deletedTag = await TagModel.findByIdAndRemove(tagId);

    if (!deletedTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    await ArticleModel.updateMany(
      { tags: tagId },
      { $pull: { tags: tagId } }
    );

    res.json({ message: 'Tag deleted successfully', deletedTag });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getArticlesByTagId = async (req, res, next) => {
  try {
    const tagId = req.params.tagId;
    const articles = await ArticleModel.find({ tags: { $in: [tagId] } });
    
    if (articles.length === 0) {
      return res.status(404).json({ message: 'No articles found for the specified tag.' });
    }

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getTagsById = async (req, res, next) => {
  try {
    const tagId = req.params.tagId;
    const tags = await TagModel.find({ _id: tagId });
    
    if (tags.length === 0) {
      return res.status(404).json({ message: 'No tags' });
    }

    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
    getAllTags,
    getTagsById,
    createTag,
    updateTag,
    removeTag,
    getArticlesByTagId
};