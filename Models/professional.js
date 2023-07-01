const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectSchema = new Schema({
  reviewerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  message: { type: String, required: true },
  rating: { type: Number, required: true },
});

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
    type: Boolean,
    default: false,
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
  reviews: [ObjectSchema],
});

const Professional = mongoose.model("Professional", professionalScheema);
module.exports = Professional;
