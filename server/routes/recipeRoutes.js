const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "name email profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recipes",
      error: error.message,
    });
  }
});

// Add new recipe
router.post("/add", async (req, res) => {
  try {
    console.log("RECIPE DATA:", req.body);

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

    // Author check
    if (!author) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Create recipe
    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      category,
      cookingTime,
      image: image || "",
      author,
    });

    await recipe.save();

    // Get author details also
    const savedRecipe = await Recipe.findById(recipe._id).populate(
      "author",
      "name email profileImage"
    );

    res.status(201).json({
      message: "Recipe added successfully",
      recipe: savedRecipe,
    });
  } catch (error) {
    console.log("ADD RECIPE ERROR:", error);

    res.status(500).json({
      message: "Failed to add recipe",
      error: error.message,
    });
  }
});

// Get recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "author",
      "name email profileImage"
    );

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recipe",
      error: error.message,
    });
  }
});

// Delete recipe
router.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete recipe",
      error: error.message,
    });
  }
});

module.exports = router;