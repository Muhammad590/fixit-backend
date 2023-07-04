// Importing important packages
const express = require("express");
const ChatRoute = express.Router();
let Chat = require("../Models/chat");
let userChatNotification = require("../Models/userChatNotification");
const sendEmail = require("../utils/sendEmail");
const upload = require("../utils/uploadImages");
const {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
} = require("../utils/chathelper");

ChatRoute.route("/send-message").post(
  upload.single("chatimage"),
  async function (req, res) {
    let image = null;
    if (req.file) {
      image = "/img/" + req.file.filename;
    }

    let newChat = new Chat({
      ...req.body,
      image: image ? image : null,
      from: JSON.parse(req.body.sender),
      to: req.body.roomId,
    });

    newChat
      .save()
      .then(async (chat) => {
        let roomMessages = await getLastMessagesFromRoom(req.body.roomId);
        roomMessages = await sortRoomMessagesByDate(roomMessages);
        // console.log("get aggregate", req.io);
        req.io.to(req.body.roomId).emit("room-messages", roomMessages);
        // socket.broadcast.emit("notification", room);
        res.status(200).json({ chat });
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
ChatRoute.route("/delete-room-chat/:roomId").delete(function (req, res) {
  Client.findById({ _id: req.params.id })
    .deleteOne()
    .then(() => {
      res.status(200).json({ User: "User Delted successfully" });
    });
});

ChatRoute.route("/getall-notifications").get(function (req, res) {
  userChatNotification.find({}, function (err, notifications) {
    if (err) {
      res.status(500).json(err);
    } else {
      if (!notifications) {
        res.send(err);
      } else {
        res.status(200).json({ notifications });
      }
    }
  });
});
module.exports = ChatRoute;
