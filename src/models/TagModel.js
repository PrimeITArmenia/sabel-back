const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			maxlength: 128,
			index: true,
			trim: true,
		},
		description: {
			type: String,
		}
	},
	{
		timestamps: true,
	},
);

const TagModel = mongoose.model("Tag", tagSchema);

module.exports = TagModel;
