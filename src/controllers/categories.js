const httpStatus = require("http-status");
const { omit } = require("lodash");
const { CategoryModel } = require("../models/index");
const { ArticleModel } = require("../models/index");

/**
 * Load article and append to req.
 * @public
 */
const load = async (req, res, next, id) => {
	const { linked } = req.query || null;

	try {
		const category = await CategoryModel.get(id, linked);
		
		req.locals = { category };
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
	try {	
		const categories = await CategoryModel.list(req.query);
		const transformedCategories = categories.map(category => ({
			id: category._id,
			name: category.name,
			description: category.description,
			articles: category.articles
		}));
		res.json(transformedCategories);
	} catch (error) {
		next(error);
	}
};

/**
 * Get article
 * @public
 */
const read = (req, res) => res.json(req.locals.category);

/**
 * Create new article
 * @public
 */
const create = async (req, res, next) => {
	if (req.file) {
		req.body.image = req.file.filename;
	}
	try {
		const category = new CategoryModel(req.body);
		const savedCategory = await category.save();
		res.status(httpStatus.CREATED);
		res.json(savedCategory);
	} catch (error) {
		next(error);
	}
};

/**
 * Update existing article
 * @public
 */
const update = (req, res, next) => {
	if (req.file) {
		req.body.image = req.file.filename;
	}
	const category = Object.assign(req.locals.category, req.body);

	category
		.save()
		.then(savedCategory => res.json(savedCategory))
		.catch(e => next(e));
};

/**
 * Delete article
 * @public
 */
const remove =async (req, res, next) => {
	const {categoryId} = req.params;
	try{
		const { category } = req.locals;
		const id = category._id;
		await CategoryModel.findByIdAndDelete(id);
		res.status(httpStatus.NO_CONTENT).end()
	} catch(error) {
		next(error)
	}
};

/**
 * Get articles belonging to a specific category
 * @public
 */

const getCategoryById = async (req, res, next) => {
	try {
		const { category } = req.locals;
		res.json(category);
	} catch(error) {
		next(error)
	}
}

module.exports = {
	load,
	read,
	list,
	create,
	update,
	remove,
	getCategoryById
};
