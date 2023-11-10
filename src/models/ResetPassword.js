const mongoose = require("mongoose");

const ResetPasswordSchem = new mongoose.Schema(
	{
        email: {
            type: String,
            required: true,
          },
          token: {
            type: String,
            required: true,
          },
          expireTime: {
            type: Date,
            required: true,
          },
        },
        {
          timestamps: true,
    }
);

const ResetPasswordModel = mongoose.model("ResetPassword", ResetPasswordSchem);

module.exports = ResetPasswordModel;
