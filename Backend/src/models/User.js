"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type:     String,
    required: true,
    trim:     true,
  },

  email: {
    type:      String,
    required:  true,
    unique:    true,
    lowercase: true,
  },

  password: {
    type:      String,
    required:  true,
    minlength: 6,
  },

  /* ── Firebase / Social auth fields ── */

  firebaseUid: {
    type:    String,
    default: null,
    sparse:  true,   // allows multiple null values with unique index
    unique:  true,
  },

  provider: {
    type:    String,
    default: "email", // "email" | "google.com" | "github.com" | "facebook.com" | "phone"
  },

  picture: {
    type:    String,
    default: null,   // profile photo URL from Google/GitHub/Facebook
  },

  phone: {
    type:    String,
    default: null,   // for phone/OTP login users
  },

  createdAt: {
    type:    Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("User", userSchema);