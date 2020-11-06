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

// sample database
const db = {
  "vulchivijay": {
    "name": "Vijaya Kumar",
    "currency": "Rs",
    "balance": 10000,
    "description": "Saving account",
    "transactions": []
  }
}

// Configure routes
const router = express.Router();

// Register all our routes
app.use(apiRoot, router);

router.get("/", (req, res) => {
  res.send(`${package.description} - version ${package.version}`);
})

router.get("/accounts/:user", (req, res) => {
  const user = req.params.user;
  const account = db[user];
  if (!account) {
    return res
              .status(404)
              .json({error: "User does not exit!", user: `${user}`});
  } else {
    return res.json(account);
  }
});

router.post("/accounts/", (req, res) => {
  const body = req.body;
  // validate required values
  if (!body.user || !body.currency) {
    return res
              .status(400)
              .json({error: "User and current are required!"});
  }

  // check account does not exit
  if (db[body.user]) {
    return res
              .status(400)
              .json({error: "Account already exists!"});
  }

  // balance
  let balance = body.balance;
  if (balance && typeof(balance) !== "number") {
    balance = parseFloat(balance);
    if (isNaN(balance)) {
      return res
                .status(400)
                .json({error: "Balance must be a number!"});
    }
  }

  // create the account!
  const account = {
    user: body.user,
    currency: body.currency,
    description: body.description || `${body.user}'s account`,
    balance: body.balance || 0,
    transactions: []
  };

  // return account
  return res
            .status(201)
            .json(account);
})

app.listen(port, () => {
  console.log("Server up!");
});

/*
{ "Content-Type": "application/json" }
{ "user": "Raju", "currency": "USD", "balance": 100, "transactions": []}
 */