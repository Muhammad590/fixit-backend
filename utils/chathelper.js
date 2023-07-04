const Chat = require("../Models/chat");
const Client = require("../Models/client");
const userChatNotifications = require("../Models/userChatNotification");
const Professional = require("../Models/professional");
async function getLastMessagesFromRoom(room) {
  console.log("romm===", room);
  let roomMessages = await Chat.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}
async function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    return date1 < date2 ? -1 : 1;
  });
}
async function createNotificationInDataBase(
  type,
  senderUserName,
  recieverId,
  text
) {
  let newModelObj = new Notification({
    text,
    personType: type,
    personID: recieverId,
    seen: false,
  });
  let savedObj = await newModelObj.save();
  return savedObj;
}
async function followingProfessional(client, professional) {
  try {
    await Client.findOneAndUpdate(
      { _id: client },
      { $addToSet: { chatIds: { $each: [professional] } } },
      { new: true }
      // {
      //   $push: { chatIds: profID },
      // },
      // {
      //   new: true,
      //   useFindAndModify: false,
      // }
    );
    console.log("Following successfull...");
  } catch (error) {
    console.log("Something wents wrong", error);
  }
}
async function followingClient(sender, reciever) {
  try {
    await Professional.findOneAndUpdate(
      { _id: sender },
      { $addToSet: { chatIds: { $each: [reciever] } } },
      { new: true }
      // {
      //   $push: { chatIds: profID },
      // },
      // {
      //   new: true,
      //   useFindAndModify: false,
      // }
    );
    console.log("Following successfull...222");
  } catch (error) {
    console.log("Something wents wrong", error);
  }
}

async function sendChatNotifications(uniqueId, messageTo) {
  try {
    const notificationFound = await userChatNotifications.findOne({ uniqueId });
    if (notificationFound) {
      const updatedNotification = await userChatNotifications.findOneAndUpdate(
        { uniqueId },
        { $inc: { count: 1 }, seen: false },
        { new: true }
      );
    } else {
      let newNotification = new userChatNotifications({
        messageTo,
        seen: false,
        count: 1,
        uniqueId: uniqueId,
      });
      await newNotification.save();
    }
  } catch (error) {
    console.log("Something wents wrong", error);
  }
}

module.exports = {
  getLastMessagesFromRoom,
  sortRoomMessagesByDate,
  createNotificationInDataBase,
  followingProfessional,
  followingClient,
  sendChatNotifications,
};
