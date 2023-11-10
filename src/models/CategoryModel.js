const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const APIError = require("../errors/APIError");

/**
 * Categories list
 */
const categories = [null, "Food for Soul", "Tech Renaissance", "The amazing Ordinary", "La Force tranquille"];
/**
 * Category Schema
 * @private
 */
const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			maxlength: 128,
			index: true,
			trim: true,
		},
		description: {
			type: String,
			index: true,
			trim: true,
		},
		articles: [{
			type: Schema.Types.ObjectId,
			ref: 'Article'
		}]
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
categorySchema.pre("save", async next => {
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
categorySchema.statics = {
	// types,
	// visibilities,
	// categories,

	/**
	 * Get article
	 *
	 * @param {ObjectId} id - The objectId of article.
	 * @returns {Promise<Article, APIError>}
	 */
	async get(id, linked) {
		let category;

		if (mongoose.Types.ObjectId.isValid(id)) {
			if (linked === 'true') {
				category = await this.findById(id).populate({
				  path: 'articles',
				  match: { position: { $ne: null }, status: 'published' },
				  options: { sort: { position: 1 } }
				}).exec();
			} else {
			category = await this.findById(id).populate({
				path: 'articles',
				match: { position: null, status: 'published' },
			}).exec();
			}
		}

		if (category) {
			return category;
		}

		throw new APIError({
			message: "Category does not exist",
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
		let options = omitBy({ title, description, category }, isNil);

		if (query) {
			options = {
				title: { $regex: query, $options: "i" },
				// category: { $regex: query, $options: "i" },
			};
		}

		return this.find(options)
			.sort({ createdAt: -1 })
			.skip(perPage * (page - 1))
			.limit(perPage)
			.populate('articles')
			.exec();
	},
};

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
