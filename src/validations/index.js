const { required } = require("joi");
const article = require("./article");
const auth = require("./auth");
const category = require("./category");
const tag = required("./tag");
const comment = required("./comment");

module.exports = {
	article,
	auth,
	category,
	tag,
	comment
};
