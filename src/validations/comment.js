const Joi = require('joi');

const validations = {
    createComment: {
        body: Joi.object({
            content: Joi.string().required(),
            // userId: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
            articleId: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
        }),
    },
    updateComment: {
        body: Joi.object({
            content: Joi.string().required(),
            // userId: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
            articleId: Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$')).required(),
        }),
        params: Joi.object({
            commentId: Joi.string().alphanum().required(),
        }),
    },
    deleteComment: {
        params: Joi.object({
            commentId: Joi.string().alphanum().required(),
        }),
    }
}

module.exports = validations;

