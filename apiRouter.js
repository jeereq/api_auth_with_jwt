const express = require("express");
const userCtrl = require("./routes/usersCtrl");
const messageCtrl = require("./routes/messagesCtrl");
const likesCtrl = require("./routes/likesCtrl");

exports.router = (() => {
	const apiRouter = express.Router();

	//user

	apiRouter.route("/users/register/").post(userCtrl.register);
	apiRouter.route("/users/login/").post(userCtrl.login);
	apiRouter.route("/users/me/").get(userCtrl.getUserProfil);
	apiRouter.route("/users/me/").put(userCtrl.updateUserProfile);
	apiRouter.route("/users/").get(userCtrl.allUsers);

	//message

	apiRouter.route("/messages/new").post(messageCtrl.createMessage);
	apiRouter.route("/messages/").post(messageCtrl.listMessage);

	//likes

	apiRouter.route("/messages/:messageId/vote/like").post(likesCtrl.likePost);
	apiRouter
		.route("/messages/:messageId/vote/dislike")
		.post(likesCtrl.dislikePost);

	return apiRouter;
})();
