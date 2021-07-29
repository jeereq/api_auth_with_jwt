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
	},
	parseAuthorization: (authorization) => {
		return authorization != null ? authorization.replace("Bearer ", "") : null;
	},
	getUSerId: (authorization) => {
		let userId = -1;
		const token = module.exports.parseAuthorization(authorization);

		if (token != null)
			try {
				const jwtToken = jwt.verify(token, JWT_SIGN_SECRET);

				if (jwtToken != null) userId = jwtToken.userId;
			} catch (err) {
				console.log(err);
			}

		return userId;
	}
};
