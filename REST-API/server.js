const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const package = require('./package.json');

const apiRoot = "/";
const port = process.env.port || process.env.PORT || 3000;
const app = express();

// Configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options('*', cors());

// Configure routes
const router = express.Router();

// Register all our routes
app.use(apiRoot, router);

router.get("/", (req, res) => {
  res.send(`${package.description} - version ${package.version}`);
})

app.listen(port, () => {
  console.log("Server up!");
});