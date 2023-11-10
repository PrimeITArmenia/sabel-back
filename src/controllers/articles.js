const httpStatus = require("http-status");
const { omit } = require("lodash");
const { ArticleModel, UserModel, CommentModel } = require("../models/index");
const { ObjectId } = require('mongodb');
const jwt_decode = require('jwt-decode');
const path = require('path');
const fs = require('fs');
const ArticleService = require('../services/article');
/**
 * Load article and append to req.
 * @public
 */
const load = async (req, res, next, id) => {
	try {
		const article = await ArticleModel.get(id);
		req.locals = { article };

		return next();
	} catch (error) {
		return next(error);
	}
};

/**
 * Get article list
 * @public
 */

const list = async (req, res, next) => {
	const page = parseInt(req.query.page);
	const perPage = process.env.perPage || 5;
	const token = req.headers.authorization;

	try {
		const totalCount = await ArticleModel.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
		let articles;

		if (token) {
			const userRole = jwt_decode(token).role;
			
			if (userRole === 'admin') {
				articles = await ArticleModel.list({page, perPage, query: req.query});
			} else {
				articles = await ArticleModel.list({ page, perPage, query: { ...req.query, status: 'published' } });
			}
		} else {
			articles = await ArticleModel.list({ page, perPage, query: { ...req.query, status: 'published' } });
		}
	  
		const transformedArticles = articles.map((article) => ({
			id: article._id,
			image: article.image,
			title: article.name,
			status: article.status,
			categories: article.category,
			content: article.content,
			tag: article.tag,
			date: article.date,
			time: article.time,
			position: article.position
		}));
		res.json({
			articles: transformedArticles,
			totalPages
		});
	} catch (error) {
	  next(error);
	}
  };

/**
 * Get article
 * @public
 */
const read = (req, res) => {
	return res.json(req.locals.article)};

/**
 * Create new article
 * @public
 */
const create = async (req, res, next) => {
	ArticleService.create(req, res, next);
}
/**
 * Update existing article
 * @public
 */
const update = async (req, res, next) => {
	const { name } = req.body;
    const updateFields = { name };

	if (req.file) {
		const filename = req.file.filename;
		const imageUrl = `http://localhost:8081/uploads/${filename}`;
		updateFields.image = imageUrl;
	}

	const article = Object.assign(req.locals.article, updateFields);

	const { position } = req.body
	try {
		const existingArticle = await ArticleModel.findOne({ position });

		if (existingArticle) {
			existingArticle.position = null;
			await existingArticle.save();
		}
	} catch(error) {
		next(error);
	}
	
	article
		.save()
		.then(savedarticle => res.json(savedarticle))
		.catch(e => next(e));
};

/**
 * Delete article
 * @public
 */
const remove = async (req, res, next) => {
	try{
		const { article } = req.locals;
		const id = article._id;
		const articleComment = article.comments
		
		await Promise.all(
			article.comments.map(async (commentId) => {
			  await CommentModel.findByIdAndDelete(commentId);
			})
		);
		await ArticleModel.findByIdAndDelete(id);
		res.status(httpStatus.NO_CONTENT).end()
	} catch(error) {
		next(error)
	}
};

const addFavoriteArticle = async (req, res) => {
	const { article: foundArticle } = req.locals;
	const articleId = foundArticle._id;
  
	const token = req.headers.authorization;
	let userId = jwt_decode(token).sub;
  
	if (!ObjectId.isValid(userId) || !ObjectId.isValid(articleId)) {
	  return res.status(400).json({ error: 'Invalid user or article ID' });
	}
	try {
	  const user = await UserModel.findOne({ _id: userId });
  
	  if (!user) {	
		return res.status(404).json({ error: 'User not found' });
	  }
  
	  const article = await ArticleModel.findOne({ _id: articleId });
  
	  if (!article) {
		return res.status(404).json({ error: 'Article not found' });
	  }

	  const userUpdateQuery = user.favorite_articles.includes(articleId)
        ? { $pull: { favorite_articles: articleId } }
        : { $addToSet: { favorite_articles: articleId } };

      await UserModel.updateOne({ _id: userId }, userUpdateQuery);

      const message = user.favorite_articles.includes(articleId)
        ? 'Article removed from favorites'
        : 'Article added to favorites';
  
	  res.status(200).json({ message });
	} catch (error) {
	  console.error('Error adding favorite article:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
}

const getFavoriteArticles = async (req, res) => {
	const token = req.headers.authorization;
	let userId = jwt_decode(token).sub;

	try {
		const user = await UserModel.findById({_id: userId}).populate('favorite_articles');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteArticles = user.favorite_articles;

    res.status(200).json(favoriteArticles);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getShowHomeArticles = async (req, res, next) => {
	try {
		let articles = await ArticleModel.find({ showHome: true , status: 'published' }).sort({ _id: -1 }).limit(3);

		if (articles.length === 0) {
			articles = await ArticleModel.find({ status: 'published' }).sort({ _id: -1 }).limit(3);
		}

		res.json(articles);
	} catch(error) {
		console.error(error);
		res.status(500).send('Internal server error');
	}
}

module.exports = {
	load,
	read,
	list,
	create,
	update,
	remove,
	addFavoriteArticle,
	getFavoriteArticles,
	getShowHomeArticles
};
