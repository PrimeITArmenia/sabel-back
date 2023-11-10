const Joi = require("joi");

const validations = {
    // POST /v1/categories
    createCategory: {
        body: Joi.object({
            name: Joi.string().max(128).required(),
            description: Joi.string().allow(''),
            articles: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')))
        }),
    },

    // PATCH /v1/categories/:categoryId
    updateCategory: {
        body: Joi.object({
            name: Joi.string().max(128),
            description: Joi.string().allow(''),
            articles: Joi.array().items(Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')))
        }),
        params: Joi.object({
            categoryId: Joi.string().alphanum().required(),
        }),
    },

    // DELETE /v1/categories/:categoryId
    deleteCategory: {
        params: Joi.object({
            categoryId: Joi.string().alphanum().required(),
        }),
    },

    // GET /v1/categories/:categoryId
    getCategoryById: {
        params: Joi.object({
            categoryId: Joi.string().alphanum().required(),
        }),
    },
};

module.exports = validations;
