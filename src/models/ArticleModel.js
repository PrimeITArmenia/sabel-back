const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const APIError = require("../errors/APIError");
require('dotenv').config();

/**
 * Types list
 */
const types = ["poll", "survey"];
/**
 * Visibility list
 */
const visibilities = ["public", "private"];

/**
 * Statuses list
 */
const statuses = ["draft", "published", "pending"];

/**
 * Article Schema
 * @private
 */
const articleSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			maxlength: 128,
			index: true,
			trim: true,
		},
		description: {
			type: String,
		},
		content: {
			type: String,
			trim: true,
		},
		image: {
			type: String,
			trim: true,
		},
		type: {
			type: String,
			enum: types,
			default: types[0],
		},
		tags: [{
			type: Schema.Types.ObjectId,
			ref: 'Tag'
		}],
		category: {
			type: Schema.Types.ObjectId, 
			ref: 'Category'
		},
		comments: [{
			type: Schema.Types.ObjectId, 
			ref: 'Comment'
		}],
		position: {
			type: String,
			default: null
		},
		date: {
			type: Date,
			default: Date.now
		  },
		time: {
			type: String
		},
		visibility: {
			type: String,
			enum: visibilities,
			default: visibilities[0],
		},
		isPublish: {
			type: Boolean,
			default: false
		},
		showHome: {
			type: Boolean,
			default: false
		},
		status: {
			type: String,
			enum: statuses,
			default: statuses[0],
		},
		start: {
			type: Date,
		}
	},
	{
		timestamps: true,
	},
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
articleSchema.pre("save", async next => {
	try {
		// some changes
		return next();
	} catch (error) {
		return next(error);
	}
});

/**
 * Statics
 */
articleSchema.statics = {
	types,
	visibilities,
	// categories,
	statuses,

	/**
	 * Get article
	 *
	 * @param {ObjectId} id - The objectId of article.
	 * @returns {Promise<Article, APIError>}
	 */
	async get(id) {
		let article;

		if (mongoose.Types.ObjectId.isValid(id)) {
			article = await this.findById(id)
			.populate({
			path: 'comments', populate: {
				path: 'userId',
				select: 'name'
			}})
			.populate({
				path: 'tags',
				select: 'name'
			})
			.exec();
		}
		if (article) {
			return article;
		}

		throw new APIError({
			message: "Article does not exist",
			status: httpStatus.NOT_FOUND,
		});
	},

	/**
	 * List articles in descending order of 'createdAt' timestamp.
	 *
	 * @param {number} skip - Number of articles to be skipped.
	 * @param {number} limit - Limit number of articles to be returned.
	 * @returns {Promise<Article[]>}
	 */

list({ page = 1, perPage = 5, title, description, category, query }) {
	console.log('query', query)
	let options = omitBy({ title, description, category }, isNil);

	if (query) {
		options = {
			title: { $regex: query, $options: "i" },
			// category: { $regex: query, $options: "i" },
		};
	}

	if (query && query.status) {
		options.status = query.status;
	  }

	return this.find(options)
		.populate({
			path: 'category',
			select: 'name'
		})
		.populate({
			path: 'tags',
			select: 'name'
		})
		.sort({ createdAt: -1 })
		.skip(perPage * (page - 1))
		.limit(perPage)
		.exec();
},
};

const ArticleModel = mongoose.model("Article", articleSchema);

// ArticleModel.createIndexes({ title: "text", category: "text" });

module.exports = ArticleModel;
