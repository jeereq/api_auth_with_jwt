const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./apiRouter").router;

const app = express();

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//config routes
app.get("/", (req, res) => {
	res.setHeader("Content-type", "text/html");
	res.status(200).send("<h1>hellog guys</h1>");
});

app.use("/api", apiRouter);

app.listen(3500, () => {
	console.log("yes");
});
