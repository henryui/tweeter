"use strict";

const userHelper    = require("../lib/util/user-helper");

const express       = require('express');
const usersRoutes  = express.Router();

module.exports = function (DataHelpers) {

  usersRoutes.get("/", function (req, res) {

    res.status(200).json(req.session);
  });

  usersRoutes.post("/login", function (req, res) {

    DataHelpers.loginTweet(req.body.userid, req.body.password, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (result[0] === "true") {
          req.session.uid = result[1];
        } else {
          req.session = null;
        }

        res.status(200).json(result);
      }
    });
  });

  usersRoutes.post("/register", function (req, res) {
    const avatar = userHelper.generateRandomUser().avatars.regular;
    DataHelpers.registerTweet(req.body.username, req.body.userid, req.body.password, avatar, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (result[0] === "true") {
          req.session.uid = result[1];
        } else {
          req.session = null;
        }

        res.status(200).json(result);
      }
    });
  });

  usersRoutes.post("/logout", function (req, res) {
    req.session = null;

    res.status(200).send();
  });

  return usersRoutes;

};
