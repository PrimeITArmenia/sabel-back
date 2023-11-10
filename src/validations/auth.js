const Joi = require("joi");

const validations = {
	// POST /v1/auth/signup
	signup: {
		body: Joi.object({
			email: Joi.string().email().required(),
			name: Joi.string(),
			password: Joi.string().required().min(6).max(128),
		}),
	},

	// POST /v1/auth/signin
	signin: {
		body: Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().required().max(128),
		}),
	},

	// POST /v1/auth/signout
	signout: {
		body: Joi.object({}),
	},
	// POST /v1/auth/refresh
	refresh: {
		body: Joi.object({
			email: Joi.string().email().required(),
			refreshToken: Joi.string().required(),
		}),
	},
};

module.exports = validations;
