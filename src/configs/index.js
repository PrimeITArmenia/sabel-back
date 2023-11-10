const app = require("./app");
const logger = require("./logger");
const mongoose = require("./mongoose");
const passport = require("./passport");
const vars = require("./vars");
const upload = require("./upload");

module.exports = {
	app,
	logger,
	mongoose,
	passport,
	vars,
	upload,
};
