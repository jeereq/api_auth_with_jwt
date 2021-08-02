const models = require("../models/index");
const jwtUtils = require("../utils/jwt.utils");

module.exports = {
	likePost: (req, res) => {
		const headersAuth = req.headers["authorization"];
		const userId = jwtUtils.getUSerId(headersAuth);

		const messageId = parseInt(req.query.messageId);

		if (messageId <= 0)
			return res.status(400).json({ error: "invalid parameters" });

		models.Message.findOne({
			where: {
				id: messageId
			}
		})
			.then((messageFound) => {
				if (messageFound)
					return models.User.findOne({ where: { id: userId } })
						.then((userFound) => {
							if (userFound)
								return models.Like.findOne({
									where: {
										userId,
										messageId
									}
								})
									.then((isUserALreadyLiked) => {
										if (!isUserALreadyLiked)
											messageFound
												.addUser(userFound)
												.then((alreadyLikeFound) => {
													messageFound
														.update({
															likes: messageFound.likes + 1
														})
														.then(() => {
															if (messageFound)
																return res.status(201).json(messageFound);
															res
																.status(500)
																.json({ error: "cannot update message" });
														})
														.catch((err) => {
															res.status(500).json({
																error: "cannot update message like counter"
															});
														});
												})
												.catch((err) => {
													res
														.status(500)
														.json({ error: "unable to set user action" });
												});
										res.status(409).json({ error: "message already liked" });
									})
									.catch((err) => {
										res.status(500).json({
											error: "unable to verify is user already liked"
										});
									});
							res.status(404).json({ error: "user not exist" });
						})
						.catch((err) => {
							res.status(500).json({ error: "unable to verify user" });
						});
				res.status(404).json({ error: "post already liked" });
			})
			.catch((err) => {
				res.status(500).json({ error: "unable to verify message  " });
			});
	},
	dislikePost: (req, res) => {
		const headersAuth = req.headers["authorization"];
		const userId = jwtUtils.getUSerId(headersAuth);

		const messageId = parseInt(req.query.messageId);

		if (messageId <= 0)
			return res.status(400).json({ error: "invalid parameters" });

		models.Message.findOne({
			where: {
				id: messageId
			}
		})
			.then((messageFound) => {
				if (messageFound)
					return models.User.findOne({ where: { id: userId } })
						.then((userFound) => {
							if (userFound)
								return models.Like.findOne({
									where: {
										userId,
										messageId
									}
								})
									.then((isUserALreadyLiked) => {
										if (isUserALreadyLiked)
											isUserALreadyLiked
												.destroy(userFound)
												.then((alreadyLikeFound) => {
													messageFound
														.update({
															likes: messageFound.likes - 1
														})
														.then(() => {
															if (messageFound)
																return res.status(201).json(messageFound);
															res
																.status(500)
																.json({ error: "cannot update message" });
														})
														.catch((err) => {
															res.status(500).json({
																error: "cannot update message like counter"
															});
														});
												})
												.catch((err) => {
													res
														.status(500)
														.json({ error: "unable to set user action" });
												});
										res.status(409).json({ error: "message already liked" });
									})
									.catch((err) => {
										res.status(500).json({
											error: "unable to verify is user already liked"
										});
									});
							res.status(404).json({ error: "user not exist" });
						})
						.catch((err) => {
							res.status(500).json({ error: "unable to verify user" });
						});
				res.status(404).json({ error: "post already liked" });
			})
			.catch((err) => {
				res.status(500).json({ error: "unable to verify message  " });
			});
	}
};
