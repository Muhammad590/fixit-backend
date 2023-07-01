const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let clientScheema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  termsAndConditions: {
    type: String,
  },
  gdpr: {
    type: String,
  },
  accountType: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  chatIds: {
    type: Array,
    default: [],
  },
});

const Client = mongoose.model("Client", clientScheema);
module.exports = Client;
