const Joi = require("joi");

const Article = require("../models/ArticleModel");

const validations = {
	// GET /v1/articles
	listArticles: {
		query: Joi.object({
			page: Joi.number(),
			perPage: Joi.number(),
			query: Joi.string(),
			name: Joi.string().min(3).max(50),
			description: Joi.string().max(250),
			content: Joi.string(),
			position: Joi.string(),
			type: Joi.any().allow(...Article.types),
			category:Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
			tags: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$'))),
			comments: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$'))),
			// category: Joi.any().allow(...Article.categories),
			category:Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
			showHome: Joi.boolean()
		}),
	},

	// POST /v1/articles
	createArticle: {
		body: Joi.object({
			name: Joi.string().min(3).max(50),
			content: Joi.string(),
			description: Joi.string().max(250),
			thanks: Joi.string(),
			image: Joi.string(),
			type: Joi.any()
				.allow(...Article.types),
			// category: Joi.any().allow(...Article.categories),
			category:Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
			tags: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$'))),
			comments: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$'))),
			date: Joi.date(),
			time: Joi.string(),
			isPublish: Joi.boolean(),
			position: Joi.string(),
			showHome: Joi.boolean(),
			// access: Joi.any(),
			visibility: Joi.any().allow(...Article.visibilities),
			// anonymous: Joi.boolean(),
			status: Joi.any().allow(...Article.statuses),
			start: Joi.date(),
			end: Joi.date(),
			// joinable: Joi.boolean(),
			// questions: Joi.any(),
		}),
	},

	// GET /v1/articles/:articleId
	readArticle: {
		params: Joi.object({
			articleId: Joi.string().alphanum().required()
		}),
	},

	// PATCH /v1/articles/:articleId
	updateArticle: {
		body: Joi.object({
			name: Joi.string().min(3).max(50).required(),
			content: Joi.string(),
			description: Joi.string().max(250),
			thanks: Joi.string(),
			image: Joi.string(),
			type: Joi.any()
				.allow(...Article.types),
			// category: Joi.any().allow(...Article.categories),
			category:Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')),
			tags: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$'))),
			comments: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$'))),
			date: Joi.date(),
			time: Joi.string(),
			isPublish: Joi.boolean(),
			position: Joi.string(),
			showHome: Joi.boolean(),
			visibility: Joi.any().allow(...Article.visibilities),
			// anonymous: Joi.boolean(),
			status: Joi.any().allow(...Article.statuses),
			start: Joi.date(),
			end: Joi.date(),
		}),
		params: Joi.object({
			articleId: Joi.string().alphanum().required(),
		}),
	},

	// DELETE /v1/articles/:articleId
	deleteArticle: {
		params: Joi.object({
			articleId: Joi.string().alphanum().required(),
		}),
	},

	addFavoriteArticle: {
		params: Joi.object({
			articleId: Joi.string().alphanum().required(),
		}),
	}
};

module.exports = validations;
