const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/:userId/follow", async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentUserId } = req.body;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (currentUserId === userId) {
      return res.status(400).json({
        message: "Cannot follow yourself"
      });
    }

    if (!currentUser.following) {
      currentUser.following = [];
    }

    if (!targetUser.followers) {
      targetUser.followers = [];
    }

    const alreadyFollowing = currentUser.following.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyFollowing) {
      currentUser.following =
        currentUser.following.filter(
          (id) => id.toString() !== userId.toString()
        );

      targetUser.followers =
        targetUser.followers.filter(
          (id) => id.toString() !== currentUserId.toString()
        );

      await currentUser.save();
      await targetUser.save();

      return res.json({
        message: "Unfollowed successfully"
      });
    }

    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: "Followed successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;