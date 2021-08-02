const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiRouter = require("./apiRouter").router;

const port = process.env.PORT || 3500;

const app = express();

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//config routes
app.get("/", (req, res) => {
	res.setHeader("Content-type", "text/html");
	res.status(200).send("<h1>hellog guys</h1>");
});

app.use("/api", apiRouter);

app.listen(port, () => {
	console.log("yes");
});
