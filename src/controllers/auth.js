const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const User = require("../models/UserModel");
const RefreshToken = require("../models/RefreshTokenModel");
const { jwtExpirationInterval } = require("../configs/vars");
const sendMail = require('../email/sendEmail');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
	const tokenType = "Bearer";
	const refreshToken = RefreshToken.generate(user).token;
	const expiresIn = moment().add(jwtExpirationInterval, "minutes");

	return {
		tokenType,
		accessToken,
		refreshToken,
		expiresIn,
	};
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
const signup = async (req, res, next) => {
	console.log('req-body-sing-up----------', req.body)
	try {
		const userData = omit(req.body, "role");
		const user = await new User(userData).save();
		const userTransformed = user.transform();
		const token = generateTokenResponse(user, user.token());

		const message = {
			subject: 'User Registration Successful',
			text: 'Congratulations! Your user registration was successful!'
		}
		
		try {
			sendMail(user.email, message);
		} catch (error) {
			console.log('Error', error);
		}
		
		res.status(httpStatus.CREATED);
		return res.json({ token, user: userTransformed });
	} catch (error) {
		return next(User.checkDuplicateEmail(error));
	}
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
const signin = async (req, res, next) => {
	try {
		const { user, accessToken } = await User.findAndGenerateToken(req.body);
		if (!user) {
			console.log(  '------------------------------------' )
			return res.status(401).json({ message: "Unauthorized" });
		} 
		else {	
			const token = generateTokenResponse(user, accessToken);
			const userTransformed = user.transform();

			return res.json({ token, user: userTransformed, status:200 });
		}

	} catch (error) {
		return next(error);
	}
};

/**
 * Remove user session information
 * @public
 */
const signout = async (req, res, next) => {
	try {
		// do some stuff
		return res.json({ status: 200, message: "Successfully signed out" });
	} catch (error) {
		return next(error);
	}
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
const refresh = async (req, res, next) => {
	try {
		const { email, refreshToken } = req.body;
		const refreshObject = await RefreshToken.findOneAndRemove({
			userEmail: email,
			token: refreshToken,
		});
		const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
		const response = generateTokenResponse(user, accessToken);

		return res.json(response);
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	signup,
	signin,
	signout,
	refresh,
};
