const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let professionalScheema = new Schema({
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
  uq: {
    type: String,
  },
  ub: {
    type: String,
  },
  iu: {
    type: Array,
  },
  services: {
    type: Array,
  },
  prices: {
    type: Array,
  },
  termsAndConditions: {
    type: String,
  },
  accountPaymentStatus: {
    type: String,
  },
  accountType: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

const Professional = mongoose.model("Professional", professionalScheema);
module.exports = Professional;
