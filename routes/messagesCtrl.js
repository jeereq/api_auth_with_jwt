const models = require("../models/index");
const jwtUtils = require("../utils/jwt.utils");

module.exports = {
	createMessage: (req, res) => {
		const headersAuth = req.headers["authorization"];
		const userId = jwtUtils.getUSerId(headersAuth);

		const title = req.body.title;
		const content = req.body.content;

		if (title == null || content == null)
			return res.status(400).json({ error: "missing parameters" });

		if (title.length <= 2 || content.length <= 4)
			return res.status(400).json({ error: "invalid parameters" });

		models.User.findOne({ where: { id: userId } })
			.then((userFound) => {
				if (userFound)
					return models.Message.create({
						title: title,
						content: content,
						likes: 0,
						userId: userFound.id
					}).then((newMessage) => {
						if (newMessage) return res.status(201).json(newMessage);
						else return res.status(500).json({ error: "cannot post message" });
					});
				else return res.status(404).json({ error: "user not found" });
			})
			.catch((error) => {
				return res
					.status(500)
					.json({ error: "unable to verify user", the: error });
			});
	},
	listMessage: (req, res) => {
		const fields = req.query.fields;
		const limit = parseInt(req.query.limit);
		const offset = parseInt(req.query.offset);
		const order = req.query.order;

		models.Message.findAll({
			order: [order != null ? order.split(":") : ["title", "ASC"]],
			attributes: fields !== "*" && fields != null ? fields.split(",") : null,
			limit: !isNaN(limit) ? limit : null,
			offset: !isNaN(offset) ? offset : null,
			include: [
				{
					model: models.User,
					attributes: ["username"]
				}
			]
		})
			.then((messages) => {
				if (messages) return res.status(201).json(messages);
				res.status(404).json({ error: "no messages found" });
			})
			.catch((err) => {
				res.status(500).json({ error: "invalid fields" });
			});
	}
};
