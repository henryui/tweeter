"use strict";

// Basic express setup:

const PORT          = process.env.PORT || 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();

require('dotenv').config();

const {MongoClient} = require("mongodb");
const MONGODB_URI   = process.env.MONGODB_URI;
const cookieSession = require('cookie-session');
// const bcrypt        = require('bcrypt');
const seedDB        = require("./lib/seed");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2] // Change the keys value into some strings for testing
}));

// **Use 'seedDB()' below for reset/initialization of the data
// If not needed, comment the 'seedDB()' below**
// seedDB();


MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  var dbo = db.db("tweeter");

  // The `data-helpers` module provides an interface to the database of tweets.
  // This simple interface layer has a big benefit: we could switch out the
  // actual database it uses and see little to no changes elsewhere in the code
  // (hint hint).
  //
  // Because it exports a function that expects the `db` as a parameter, we can
  // require it and pass the `db` parameter immediately:
  const DataHelpers = require("./lib/data-helpers.js")(dbo);

  // The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
  // so it can define routes that use it to interact with the data layer.
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // The `users-routes` module also uses DataHelpers to log in/logout/register users
  const usersRoutes = require("./routes/userAuth")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);
  app.use("/users", usersRoutes);

  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });
});


