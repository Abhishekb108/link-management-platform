const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/basic", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, bio, profilePhoto, username, category } =
      req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, bio, profilePhoto, username, category },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/links", authMiddleware, async (req, res) => {
  try {
    const { links } = req.body;

    const updatedLinks = links.map((link) => ({
      ...link,
      clickCount: link.clickCount || 0,
    }));

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { links: updatedLinks },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/shops", authMiddleware, async (req, res) => {
  try {
    const { shops } = req.body;

    const updatedShops = shops.map((shop) => ({
      ...shop,
      clickCount: shop.clickCount || 0,
    }));

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { shops: updatedShops },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/appearance", authMiddleware, async (req, res) => {
  try {
    const { bannerColor, appearanceSettings } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { bannerColor, appearanceSettings },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/track-click", authMiddleware, async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (itemType === "link") {
      const linkIndex = user.links.findIndex(
        (link) => link._id.toString() === itemId
      );
      if (linkIndex !== -1) {
        user.links[linkIndex].clickCount =
          (user.links[linkIndex].clickCount || 0) + 1;
      }
    } else if (itemType === "shop") {
      const shopIndex = user.shops.findIndex(
        (shop) => shop._id.toString() === itemId
      );
      if (shopIndex !== -1) {
        user.shops[shopIndex].clickCount =
          (user.shops[shopIndex].clickCount || 0) + 1;
      }
    }

    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/analytics", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("links shops");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const linkAnalytics = user.links.map((link) => ({
      id: link._id,
      title: link.title,
      url: link.url,
      clickCount: link.clickCount || 0,
    }));

    const shopAnalytics = user.shops.map((shop) => ({
      id: shop._id,
      title: shop.title,
      url: shop.url,
      clickCount: shop.clickCount || 0,
    }));

    res.json({
      links: linkAnalytics,
      shops: shopAnalytics,
      totalLinkClicks: linkAnalytics.reduce(
        (sum, link) => sum + link.clickCount,
        0
      ),
      totalShopClicks: shopAnalytics.reduce(
        (sum, shop) => sum + shop.clickCount,
        0
      ),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
