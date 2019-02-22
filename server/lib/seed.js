const {MongoClient} = require("mongodb");

bcrypt = require('bcrypt');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

// This account is only for testing purpose
const userAdmin =  {
  handle: "admin",
  name: "Yunsung Oh",
  password: bcrypt.hashSync("admin", 10),
  avatar: "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png"
};

const tweets = [
  {
    user: {
      name: "Newton",
      avatars: {
        small:   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        regular: "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        large:   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      handle: "@SirIsaac"
    },
    content: {
      text: "If I have seen further it is by standing on the shoulders of giants"
    },
    created_at: 1461116232227,
    like: {}
  },
  {
    user: {
      name: "Descartes",
      avatars: {
        small:   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        regular: "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        large:   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      handle: "@rd" },
    content: {
      text: "Je pense , donc je suis"
    },
    created_at: 1461113959088,
    like: {}
  },
  {
    user: {
      name: "Johann von Goethe",
      avatars: {
        small:   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        regular: "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        large:   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      handle: "@johann49"
    },
    content: {
      text: "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    created_at: 1461113796368,
    like: {}
  }
];

// This is a function to initialize the base data above to the mongoDB
// by dropping the tweets collection, create it again and looping insert the data

const seedDB = function () {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      throw err;
    }

    var dbo = db.db("tweeter");

    dbo.collection("tweets").drop(function (err, res) {
      if (err) {
        console.log("seed.js: No tweets collection to begin with");
      }

      dbo.createCollection("tweets", function (err, res) {
        if (err) throw err;

        let counter = 0;
        for (let i = 0; i < tweets.length; i++) {
          dbo.collection("tweets").insertOne(tweets[i], function (err, res) {
            if (err) throw err;
            counter++;
            // If all of the tweets are added, add admin user
            if (counter === tweets.length) {
              dbo.collection("users").drop(function (err, res) {
                if (err) {
                  console.log("seed.js: No users collection to begin with");
                }

                dbo.createCollection("users", function (err, res) {
                  if (err) throw err;

                  dbo.collection("users").insertOne(userAdmin, function (err, res) {
                    if (err) throw err;
                    console.log("Seeding data has completed");
                    db.close();
                  });
                });
              });
            }
          });
        }
      });
    });
  });
};

module.exports = seedDB;