const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");

// ===============================
// ADD RATING
// ===============================
router.post("/", async (req, res) => {
  try {
    const { recipeId, userName, rating } = req.body;

    console.log("ADDING RATING");
    console.log("Recipe ID:", recipeId);
    console.log("User:", userName);
    console.log("Rating:", rating);

    // Check required fields
    if (!recipeId || !userName || rating === undefined || rating === null) {
      return res.status(400).json({
        message: "Recipe ID, name and rating are required",
      });
    }

    // Convert rating to number
    const ratingNumber = Number(rating);

    // Check rating value
    if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Create new rating
    const newRating = new Rating({
      recipeId: recipeId,
      userName: userName.trim(),
      rating: ratingNumber,
    });

    // Save rating
    const savedRating = await newRating.save();

    console.log("RATING SAVED:", savedRating);

    res.status(201).json({
      message: "Rating added successfully",
      rating: savedRating,
    });

  } catch (error) {
    console.log("ADD RATING ERROR:", error);

    res.status(500).json({
      message: "Failed to add rating",
      error: error.message,
    });
  }
});


// ===============================
// GET RATINGS FOR RECIPE
// ===============================
router.get("/:recipeId", async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    console.log("GET RATING REQUEST:", recipeId);

    const ratings = await Rating.find({
      recipeId: recipeId,
    }).sort({ createdAt: -1 });

    console.log("RATINGS FOUND:", ratings);

    const totalRatings = ratings.length;

    let averageRating = 0;

    if (totalRatings > 0) {
      const total = ratings.reduce(
        (sum, item) => sum + Number(item.rating),
        0
      );

      averageRating = Number(
        (total / totalRatings).toFixed(1)
      );
    }

    console.log("TOTAL RATINGS:", totalRatings);
    console.log("AVERAGE RATING:", averageRating);

    res.status(200).json({
      totalRatings: totalRatings,
      averageRating: averageRating,
      ratings: ratings,
    });

  } catch (error) {
    console.log("GET RATING ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch ratings",
      error: error.message,
    });
  }
});

module.exports = router;