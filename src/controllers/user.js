const httpStatus = require("http-status");
const { omit } = require("lodash");
const { UserModel } = require("../models/index");
const jwt_decode = require('jwt-decode');
const path = require('path');
const fs = require('fs');

const load = async (req, res, next, id) => {
	try {
		const user = await UserModel.get(id);
		req.locals = { user };

		return next();
	} catch (error) {
		return next(error);
	}
};

const getAllUsers = async (req, res, next) => {
	const page = parseInt(req.query.page) || 1;
	const perPage = process.env.perPage || 5;

	try {
		const totalCount = await UserModel.countDocuments({ isDelete: false });
        const totalPages = Math.ceil(totalCount / perPage);

        const users = await UserModel.find({ isDelete: false })
			.skip(perPage * (page - 1))
			.limit(perPage);
			
	    const transformedUsers = users.map((user) => ({
            id: user._id,
            email: user.email,
            picture: user.picture,
            name: user.name,
        }));

	    res.json({
			users: transformedUsers,
            page,
            totalPages,
		});
	} catch (error) {
	  next(error);
	}
};

const getUserById = async (req, res, next) => {
	const token = req.headers.authorization;
	const userId = jwt_decode(token).sub;
    try {
        const data = await UserModel.findOne({ _id: userId, isDelete: false }).select('-password');

        if (data) {

            res.json(data)
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
	const token = req.headers.authorization;
	const userId = jwt_decode(token).sub;
	if (req.file) {
		const filename = req.file.filename
		const imageUrl = `http://localhost:8081/uploads/users/${filename}`
		req.body.picture = imageUrl;
	}
	const { name, picture } = req.body;
	console.log('dataaa', name, picture)
	const user = await UserModel.findById(userId)
	const newUser = Object.assign(user, { name, picture });
	console.log('newUser', newUser);
	newUser
		.save()
		.then(savedUser => res.json(savedUser))
		.catch(e => next(e));
};

const remove = async (req, res, next) => {
	try{
		const {userId} = req.params
		await UserModel.findOneAndUpdate({_id: userId}, { $set: { isDelete: true } });
		res.status(httpStatus.NO_CONTENT).end()
	} catch(error) {
		next(error)
	}
};

const updateEmailPreference = async (req, res, next) => {
	const token = req.headers.authorization;
	let userId = jwt_decode(token).sub;
	const { receiveEmails } = req.body

	try {
		await UserModel.updateOne({ _id: userId }, { receiveEmails: receiveEmails });
        res.status(200).send('Email preference updated successfully');
	} catch(error) {
		next(error);
	}
}

module.exports = {
    load,
    getAllUsers,
    getUserById,
    update,
    remove,
	updateEmailPreference
};
