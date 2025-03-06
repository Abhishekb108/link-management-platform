const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email address",
      },
    },
    password: { type: String, required: true, minlength: 6 },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    category: { type: String, required: true, trim: true },
    profilePhoto: {
      type: String,
      default: "https://example.com/default-profile-photo.png",
    },
    bio: { type: String, default: "", trim: true },
    links: [
      {
        title: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
        enabled: { type: Boolean, default: false },
      },
    ],
    shops: [
      {
        title: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
        enabled: { type: Boolean, default: false },
      },
    ],
    bannerColor: { type: String, default: "#000000", trim: true },
    appearanceSettings: {
      layout: {
        type: String,
        default: "Stack",
        enum: ["Stack", "Grid", "List"],
      },
      buttonStyle: {
        type: String,
        default: "Fill",
        enum: ["Fill", "Outline", "Text"],
      },
      font: {
        type: String,
        default: "DM Sans",
        enum: ["DM Sans", "Roboto", "Open Sans"],
      },
      theme: {
        type: String,
        default: "Air Snow",
        enum: ["Air Snow", "Dark Mode", "Light Mode"],
      },
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, username: 1 });

module.exports = mongoose.model("User", userSchema);
