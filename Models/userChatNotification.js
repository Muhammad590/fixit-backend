const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userChatNotificationsSchema = new Schema(
  {
    messageTo: {
      type: String,
    },
    seen: {
      type: Boolean,
    },
    count: {
      type: Number,
    },
    uniqueId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userChatNotification = mongoose.model(
  "userChatNotification",
  userChatNotificationsSchema
);
module.exports = userChatNotification;
