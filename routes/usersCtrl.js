const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt.utils");
const models = require("../models/index");

//Routes

module.exports = {
	register: (req, res) => {
		const email = req.body.email;
		const username = req.body.username;
		const password = req.body.password;
		const bio = req.body.bio;

		if (email == null || username == null || password == null)
			return res.status(400).json({ error: "missing parameters" });

		models.User.findOne({ attributes: ["email"], where: { email: email } })
			.then((userFound) => {
				if (userFound)
					return res.status(409).json({ error: "user already exist" });
				bcrypt.hash(password, 5, (err, bcryptedpassword) => {
					const newUser = models.User.create({
						email: email,
						username: username,
						password: bcryptedpassword,
						bio: bio,
						isAdmin: 0
					})
						.then((newUser) => {
							return res.status(201).json({
								userId: newUser.id
							});
						})
						.catch((err) => {
							return res.status(500).json({ error: "cannot find user" });
						});
				});
			})
			.catch((err) => {
				return res.status(500).json({ error: "unable to verify user" });
			});
	},
	login: (req, res) => {
		//params
		const email = req.body.email;
		const password = req.body.password;

		if (email == null || password == null)
			return res.status(400).json({ error: "missing parameters" });

		models.User.findOne({
			where: { email: email }
		})
			.then((userFound) => {
				if (!userFound)
					return res.status(404).json({ error: "user not exist in db" });
				bcrypt.compare(password, userFound.password, (errBcrypt, resBcrypt) => {
					if (resBcrypt)
						return res.status(200).json({
							userId: userFound.id,
							token: jwtUtils.generateTokenForUSer(userFound)
						});
					else return res.status(403).json({ error: "invalid password" });
				});
			})
			.catch((err) => {
				return res.status(500).json({ error: "runable to vrify user" });
			});
	}
};
