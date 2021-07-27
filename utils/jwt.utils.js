const jwt = require("jsonwebtoken");

const JWT_SIGN_SECRET = "jeereq100MingandaTheBestGuysOfTheWorld100";
module.exports = {
	generateTokenForUSer: (userData) => {
		return jwt.sign(
			{
				userId: userData.id,
				isAdmin: userData.isAdmin
			},
			JWT_SIGN_SECRET,
			{
				expiresIn: "1h"
			}
		);
	}
};
