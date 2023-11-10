const mongoose = require("mongoose");
const logger = require("./logger");
const { mongo, env } = require("./vars");

// Exit application on error
mongoose.connection.on("error", err => {
	logger.error(`MongoDB connection error: ${err}`);
	process.exit(-1);
});

// print mongoose logs in dev env
if (env === "development") {
	mongoose.set("debug", true);
}

// Turn off deprication worning
mongoose.set("strictQuery", true);

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
const connect = async () => {
	try {
		await mongoose.connect(mongo.uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected...");
	} catch (e) {
		console.log("MongoDB does not connected...", e.message);
	}

	return mongoose.connection;
};

module.exports = {
	connect,
};
