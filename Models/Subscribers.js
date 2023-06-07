const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Usermodel = new Schema({
  name: {
    type: String,
  },
  review: {
    type: Number,
  },
  reviewCount: {
    type: Number,
  },
  phone: {
    type: String,
  },
  location: {
    type: String,
  },
  service: {
    type: String,
  },
  profession: {
    type: String,
  },
  bio: {
    type: String,
  },
  services: {
    type: String,
  },

  bannerimage: {
    type: String,
  },

  profileimage: {
    type: String,
  },

  imageupload: {
    type: Array,
  },

  qualifications: {
    type: String,
  },

  email: {
    type: String,
  },
  password: {
    type: String,
  },
  review: [
    {
      senderid: {
        type: String,
      },
      sendername: {
        type: String,
      },
      rating: {
        type: Number,
      },
      reviewstatus: {
        type: String,
      },
    },
  ],
});

const User = mongoose.model("Usermodel", Usermodel);
module.exports = User;
