const Joi = require("joi");

const validations = {
    // POST /v1/tags
    createTag: {
        body: Joi.object({
            name: Joi.string().max(128).required(),
            description: Joi.string(),
        }),
    },

    // PATCH /v1/tags/:tagId
    updateTag: {
        body: Joi.object({
            name: Joi.string().max(128),
            description: Joi.string(),
        }),
        params: Joi.object({
            tagId: Joi.string().alphanum().required(),
        }),
    },

    // DELETE /v1/tags/:tagId
    deleteTag: {
        params: Joi.object({
            tagId: Joi.string().alphanum().required(),
        }),
    },

    // GET /v1/tags/:tagId
    getTagById: {
        params: Joi.object({
            tagId: Joi.string().alphanum().required(),
        }),
    },
};

module.exports = validations;
