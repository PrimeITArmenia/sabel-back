const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const User = require("../models/UserModel");
const ResetPassword = require("../models/ResetPassword");
const jwt = require('jsonwebtoken');
const sendMail = require('../email/sendEmail');
const { jwtSecret } = require("../configs/vars");
const jwt_decode = require('jwt-decode');

function generateToken(userId) {
    const payload = {
        sub: userId
    }
	const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    return token;
}

const forgot = async (req, res, next) => {
	try {
	  const { email } = req.body;
	  const user = await User.findOne({ email });
  
	  if (!user) {
		return res.status(404).send('User not found');
	  }
  
	  const token = generateToken(user.id);
	  const tokenGeneratedTime = moment();
	  const expireTime = tokenGeneratedTime.add(1, 'hour');
  
	  try {
		await ResetPassword.create({ email, token, expireTime });
  
		const message = {
		  subject: 'Password Reset',
		  text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
			  Please click on the following link, or paste this into your browser to complete the process:\n\n
			  http://localhost:3000/resetpassword/${token}\n\n
			  If you did not request this, please ignore this email and your password will remain unchanged.\n`
		};
  
		try {
		  sendMail(email, message);
		} catch (error) {
		  console.error('Error sending email:', error);
		  return res.status(500).json({ message: 'Internal Server Error' });
		}
  
		return res.status(200).json({ message: 'Reset link has been sent to your email.' });
	  } catch (error) {
		console.error('Error creating reset password:', error);
		return res.status(500).json({ message: 'Internal Server Error' });
	  }
	} catch (error) {
	  console.error('Error in forgot function:', error);
	  return res.status(500).json({ message: 'Internal Server Error' });
	}
  };

const reset = async (req, res, next) => {
    const { token, newPassword } = req.body;

    try {
        const decodedToken = jwt_decode(token);

        if (!decodedToken || !decodedToken.sub) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const userId = decodedToken.sub;

        const resetPasswordEntry = await ResetPassword.findOne({ token: token });

        if (!resetPasswordEntry) {
            return res.status(404).json({ message: 'Token not found or has expired' });
        }

        const tokenExpireTime = moment(resetPasswordEntry.expireTime);
        const requestTime = moment();

        if (requestTime.isAfter(tokenExpireTime)) {
            return res.status(400).json({ message: 'Token has expired' });
        }

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword;
        const newUser = await user.save();

		await ResetPassword.deleteOne({ token: token });

        return res.json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        if (error.name === 'InvalidTokenError') {
            return res.status(400).json({ message: 'Invalid token error occurred' });
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

const change = async (req, res, next) => {    
	const { email, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.passwordMatches(oldPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        user.password = newPassword;
        await user.save();

        return res.json({ message: 'Password has been successfully changed' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    forgot,
    reset,
	change
};

