const express = require("express");
const router = express.Router();

const Recipe = require("../models/Recipe");

// ==========================================
// GET ALL RECIPES
// ==========================================
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    console.log("Get Recipes Error:", error);

    res.status(500).json({
      message: "Failed to get recipes",
      error: error.message,
    });
  }
});

// ==========================================
// GET MY FEED
// ==========================================
router.get("/feed/:userId", async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    console.log("My Feed Error:", error);

    res.status(500).json({
      message: "Failed to load My Feed",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE RECIPE
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("author", "name email");

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.log("Get Single Recipe Error:", error);

    res.status(500).json({
      message: "Failed to get recipe",
      error: error.message,
    });
  }
});

// ==========================================
// ADD NEW RECIPE
// ==========================================
router.post("/", async (req, res) => {
  try {
    console.log("========== ADD RECIPE ==========");
    console.log("Request Body:", req.body);

    const {
      title,
      description,
      ingredients,
      instructions,
      category,
      cookingTime,
      image,
      author,
    } = req.body;

    // Required fields check
    if (!title || !description || !ingredients || !instructions) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Author असल्यासच validate कर
    if (author && !require("mongoose").Types.ObjectId.isValid(author)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      category: category || "Other",
      cookingTime: Number(cookingTime) || 0,
      image: image || "",
      author: author || undefined,
    });

    const savedRecipe = await newRecipe.save();

    console.log("Recipe Saved:", savedRecipe);

    res.status(201).json({
      message: "Recipe added successfully",
      recipe: savedRecipe,
    });
  } catch (error) {
    console.log("Add Recipe Error:", error);

    res.status(500).json({
      message: "Failed to add recipe",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE RECIPE
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRecipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.log("Update Recipe Error:", error);

    res.status(500).json({
      message: "Failed to update recipe",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE RECIPE
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(
      req.params.id
    );

    if (!deletedRecipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.log("Delete Recipe Error:", error);

    res.status(500).json({
      message: "Failed to delete recipe",
      error: error.message,
    });
  }
});

module.exports = router;