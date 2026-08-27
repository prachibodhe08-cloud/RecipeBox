const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ==========================================
// Get All Users
// ==========================================
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// ==========================================
// Get User Profile by Email
// ==========================================
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

// ==========================================
// Update User Profile
// ==========================================
router.put("/:email", async (req, res) => {
  try {
    const {
      name,
      bio,
      profileImage,
    } = req.body;

    const user = await User.findOneAndUpdate(
      {
        email: req.params.email,
      },
      {
        name,
        bio,
        profileImage,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

module.exports = router;