const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt.utils");
const models = require("../models/index");
const asyncLib = require("async");

//constantes
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

//Routes

module.exports = {
	register: (req, res) => {
		const email = req.body.email;
		const username = req.body.username;
		const password = req.body.password;
		const bio = req.body.bio;

		if (email == null || username == null || password == null)
			return res.status(400).json({ error: "missing parameters" });

		if (username.length >= 13 || username.length <= 4)
			return res
				.status(400)
				.json({ error: "wrong username (must be length 5 - 12" });

		if (!PASSWORD_REGEX.test(password))
			return res.status(400).json({ error: "password non valid" });

		models.User.findOne({ where: { email: email } })
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
	},
	allUsers: (req, res) => {
		const email = req.body.email;
		const password = req.body.password;

		if (email == null || password == null)
			return res.status(400).json({ error: "missing parameters" });

		models.User.findAll()
			.then((findAll) => {
				return res.status(200).json({ allUsers: findAll });
			})
			.catch((err) => {
				return res.status(500).json({ error: "runable to verify user" });
			});
	},
	getUserProfil: (req, res) => {
		const headersAuth = req.headers["authorization"];
		const userId = jwtUtils.getUSerId(headersAuth);

		if (userId < 0) return res.status(400).json({ error: "wrong token" });

		models.User.findOne({
			attributes: ["id", "email", "username", "bio", "password"],
			where: { id: userId }
		})
			.then((user) => {
				if (user) res.status(201).json(user);
				else res.status(404).json({ error: "user not found" });
			})
			.catch((err) => {
				res.status(500).json({ error: "cannot fetch user" });
			});
	},
	updateUserProfile: (req, res) => {
		const headersAuth = req.headers["authorization"];
		const userId = jwtUtils.getUSerId(headersAuth);

		const bio = req.body.bio;

		models.User.findOne({ attributes: ["id", "bio"], where: userId })
			.then((userFound) => {
				if (!userFound)
					return res.status(500).json({ error: "unable to verify" });

				userFound
					.update({
						bio: bio ? bio : userFound.bio
					})
					.then((userFound) => {
						if (userFound) return res.status(201).json(userFound);
						else
							return res
								.status(500)
								.json({ error: "cannot update user profile" });
					})
					.catch(() => {
						res.status(500).json({ error: "cannot update user" });
					});
			})
			.catch(() => {
				res.status(404).json({ error: "user not found" });
			});
	}
};
