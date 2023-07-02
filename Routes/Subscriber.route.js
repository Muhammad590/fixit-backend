// Importing important packages
const express = require("express");
const app = express();
const UserRoute = express.Router();
let User = require("../Models/Subscribers");
let Professional = require("../Models/professional");
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "itsoxama@gmail.com",
    pass: "jskplmughhwbcxxi",
  },
});
UserRoute.route("/add").post(function (req, res) {
  let Users = new User(req.body);
  Users.save()
    .then((User) => {
      res.status(200).json({ User: "User added successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
});
UserRoute.route("/resetpassword").post(function (req, res) {
  var a =
    "QWERTYUIOPASDFGGHJKLZXCVB123456789NMqwertyuio12345678901231sspasdfgh123456789jklzxcvbnmmmmmm123456789";

  var k = "";
  for (var i = 0; i < 8; i++) {
    var j = Math.floor(Math.random() * 100);
    k = k + a.charAt(j);
  }
  console.log(k);

  const mailOptions = {
    from: "itsoxama@gmail.com", // sender address
    to: req.body.email, // list of receivers
    subject: "test mail", // Subject line
    html: `<h1>New password is ${k} </h1>`, // plain text body
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
  User.findOneAndUpdate(
    { email: req.body.email },
    { password: k },
    { new: true },

    function (error, success) {
      if (error) {
        res.send("error");
      } else {
        if (!success) {
          res.send("invalid");
        } else {
          res.status(200).json({ User: success });
        }
      }
    }
  );
});
UserRoute.route("/update").post(function (req, res) {
  const review = {
    reviewerID: req.body.reviewerID,
    message: req.body.message,
    rating: req.body.rating,
  };
  console.log("park view society", review);
  Professional.findOneAndUpdate(
    { _id: req.body._id },
    { $push: { reviews: review } },
    { new: true }
  )
    .then((updatedDocument) => {
      if (updatedDocument) {
        res.status(201).json({
          Profesional: updatedDocument,
          message: "professional updated successfully",
        });
      } else {
        res.status(200).json({ message: "professional not found" });
      }
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res.send("error");
    });
});
UserRoute.route("/find").post(async function (req, res) {
  try {
    let user = await User.findOne({ _id: req.body.id }).populate(
      "reviews.reviewerID"
    );

    res.status(200).json({ User: user });
  } catch (error) {
    res.send(error);
  }
});
UserRoute.route("/getallusers").get(function (req, res) {
  Professional.find({}, function (err, users) {
    if (err) {
      res.send("sad");
    } else {
      if (!users) {
        res.send(err);
      } else {
        const sortedUsers = users.sort((a, b) => {
          if (a.accountPaymentStatus === b.accountPaymentStatus) {
            return 0;
          } else if (a.accountPaymentStatus) {
            return -1;
          } else {
            return 1;
          }
        });

        res.status(200).json({ users: sortedUsers });
      }
    }
  });
});
UserRoute.route("/auth").post(function (req, res) {
  User.findOne(
    { email: req.body.email, password: req.body.pass },

    function (error, success) {
      if (error) {
        res.send("error");
      } else {
        if (!success) {
          res.send("invalid");
        } else {
          res.status(200).json({ User: success });
        }
      }
    }
  );
});
UserRoute.route("/delete").post(function (req, res) {
  User.findById({ _id: req.body._id })
    .deleteOne()
    .then(() => {
      res.status(200).json({ User: "User Delted successfully" });
    });
});

module.exports = UserRoute;
