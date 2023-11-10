const bcrypt = require("bcryptjs");
const { env } = require("../src/configs/vars");

const initialUsers = [
	{
		email: "admin@sabel.com",
		password: bcrypt.hashSync("Admin123456", env === "test" ? 1 : 10),
		role: "admin"
	}
];

module.exports.up = async (db, client) => {
	try {
		const User = db.collection("users");

		const operations = [];

		for (let i = 0; i < initialUsers.length; i++) {
			const initialUser = initialUsers[i];
			const user = await User.findOne({ email: initialUser.email });

			if (!user) {
				operations.push(User.insertOne(initialUser));
			}
		}
		
		return Promise.all(operations);
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports.down = async (db, client) => {
	try {
		const User = db.collection("users");
		const operations = [];

		initialUsers.forEach(({ email }) => {
			const user = User.findOne({ email });

			if (user) {
				operations.push(User.deleteOne({ email }));
			}
		});

		return Promise.all(operations);
	} catch (err) {
		return Promise.reject(err);
	}
};
