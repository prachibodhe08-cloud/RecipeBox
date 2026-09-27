const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    ingredients: {
      type: String,
      required: true,
    },

    instructions: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "Other",
    },

    cookingTime: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);