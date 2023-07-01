const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let chatScheema = new Schema(
  {
    content: {
      type: String,
    },
    from: {
      type: Object,
    },
    time: {
      type: String,
    },
    image: {
      type: String,
    },
    date: {
      type: String,
    },
    to: { type: String },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatScheema);
module.exports = Chat;
