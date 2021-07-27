const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.setHeader("Content-type", "text/html");
	res.status(200).send("<h1>hellog guys</h1>");
});

app.listen(3000, () => {
	console.log("yes");
});
