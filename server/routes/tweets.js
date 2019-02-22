"use strict";

const userHelper    = require("../lib/util/user-helper");

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function (DataHelpers) {

  tweetsRoutes.get("/", function (req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function (req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    } else if (!req.session) {
      res.status(403).json({ error: 'invalid request: not authorized user'});
      return;
    }

    DataHelpers.findUser(req.session.uid, function (err, userinfo) {
      // const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
      const tweet = {
        user: {
          name: userinfo.name,
          avatars: {
            regular: userinfo.avatar,
          },
          handle: `@${userinfo.handle}`
        },
        content: {
          text: req.body.text
        },
        created_at: Date.now(),
        like: {}
      };

      DataHelpers.saveTweet(tweet, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).send();
        }
      });
    });
  });

  tweetsRoutes.put("/:id", function (req, res) {
    DataHelpers.likeTweet(req.params.id, req.body.liked, (err, tweetLike) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweetLike);
      }
    });
  });

  return tweetsRoutes;

};
