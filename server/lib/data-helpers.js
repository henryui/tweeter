"use strict";
const {ObjectID} = require('mongodb');

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
        });
      });
      callback(null, true);
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
    }

  };
};
