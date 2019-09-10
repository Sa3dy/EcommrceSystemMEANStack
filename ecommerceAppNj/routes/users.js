const express = require("express");
var router = express.Router();
var ObjectId = require("mongoose").Types.ObjectId;

var { User } = require("../models/user");

var userModel = User();

router.get("/getAllUsers", (req, res) => {
  User.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      res.send(
        "Error in Retriving Users :" + JSON.stringify(err, undefined, 2)
      );
      console.log(
        "Error in Retriving Users :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

router.get("/getUser/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  User.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      res.send("Error in Retriving User :" + JSON.stringify(err, undefined, 2));
      console.log(
        "Error in Retriving User :" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

router.post("/loginUser", (req, res) => {
  User.findOne({ email: req.body.email }, function(err, result) {
    if (err) {
      console.log(err);
    }

    if (result == null) {
      res.json({
        success: false,
        response: "Invalid Email Address."
      });
    } else {
      checkUserPassword(result);
    }
  });

  function checkUserPassword(userResponseData) {
    if (!(userModel.encrypt(req.body.password) == userResponseData.password)) {
      res.json({
        success: false,
        response: "Invalid Password."
      });
    } else {
      res.json({
        success: true,
        response: {
          userData: userResponseData
        }
      });
    }
  }
});

router.post("/addUser", (req, res) => {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });
  user.save((err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      res.send("Error in User Save :" + JSON.stringify(err, undefined, 2));
      console.log("Error in User Save :" + JSON.stringify(err, undefined, 2));
    }
  });
});

router.put("/updateUser/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  var user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  User.findByIdAndUpdate(
    req.params.id,
    { $set: user },
    { new: true },
    (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        res.send("Error in User Update :" + JSON.stringify(err, undefined, 2));
        console.log(
          "Error in User Update :" + JSON.stringify(err, undefined, 2)
        );
      }
    }
  );
});

router.delete("/deleteUser/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`No record with given id : ${req.params.id}`);

  User.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      res.send("Error in User Delete :" + JSON.stringify(err, undefined, 2));
      console.log("Error in User Delete :" + JSON.stringify(err, undefined, 2));
    }
  });
});

module.exports = router;
