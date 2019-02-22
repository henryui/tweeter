"use strict";
const {ObjectID} = require('mongodb');
const bcrypt     = require('bcrypt');

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers (db) {
  return {

    // Saves a tweet to `db`
    saveTweet (newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, function (err, res) {
        if (err) {
          throw err;
        }
      });
      callback(null, true);
    },

    // Likes or unlikes a tweet and updates `db`
    likeTweet (tweetID, liked, callback) {
      db.collection("tweets").findOne({"_id": ObjectID(tweetID)}, function (err, result) {
        if (err) {
          throw err;
        }
        const newValue = (liked === "true") ? result.like + 1 : result.like - 1;

        db.collection("tweets").updateOne({"_id": ObjectID(tweetID)}, {$set: {"like": newValue}}, function (err, res) {
          if (err) {
            throw err;
          }
          callback(null, newValue);
        });
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets (callback) {
      const sortNewestFirst = (a, b) => a.created_at - b.created_at;

      db.collection("tweets").find().toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets.sort(sortNewestFirst));
      });
    },

    // Get all tweets in `db`, sorted by newest first
    loginTweet (userid, password, callback) {
      db.collection("users").findOne({handle: userid}, function (err, result) {
        if (err) {
          throw err;
        } else if (!result) {
          return callback(null, ["false", null]);
        } else {
          if (!bcrypt.compareSync(password, result.password)) {
            return callback(null, ["false", null]);
          } else {
            return callback(null, ["true", result.handle]);
          }
        }
      });
    },

    registerTweet (username, userid, password, avatar, callback) {
      if (!username.replace(/\s/g, '').length || !userid.replace(/\s/g, '').length || !password.replace(/\s/g, '').length) {
        return callback(null, ["false", "Invalid Name/ID/Password"]);
      }
      db.collection("users").findOne({handle: userid}, function (err, result) {
        if (err) {
          throw err;
        } else if (!result) {
          const newUser = {
            handle: userid,
            name: username,
            password: bcrypt.hashSync(password, 10),
            avatar
          };

          db.collection("users").insertOne(newUser, function (err, res) {
            if (err) throw err;

            return callback(null, ["true", userid]);
          });
        } else {
          return callback(null, ["false", "ID already exists"]);
        }
      });
    },

    findUser (userid, callback) {
      db.collection("users").findOne({handle: userid}, function (err, result) {
        if (err) {
          throw err;
        } else if (!result) {
          return callback(null, null);
        } else {
          return callback(null, result);
        }
      });
    }

  };
};
