const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, username, category } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      username,
      category,
      profilePhoto: "https://example.com/default-profile-photo.png",
      bio: "",
      bannerColor: "#000000",
      appearanceSettings: {
        layout: "Stack",
        buttonStyle: "Fill",
        font: "DM Sans",
        theme: "Air Snow",
      },
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        category: user.category,
        profilePhoto: user.profilePhoto,
        bio: user.bio,
        bannerColor: user.bannerColor,
        appearanceSettings: user.appearanceSettings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
