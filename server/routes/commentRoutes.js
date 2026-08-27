const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// Add Comment
router.post("/", async (req, res) => {
  try {
    const { recipeId, userName, commentText } = req.body;

    const newComment = new Comment({
      recipeId,
      userName,
      commentText,
    });

    await newComment.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
});


// Get Comments by Recipe
router.get("/:recipeId", async (req, res) => {
  try {
    const comments = await Comment.find({
      recipeId: req.params.recipeId,
    }).sort({ createdAt: -1 });

    res.status(200).json(comments);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
});


module.exports = router;