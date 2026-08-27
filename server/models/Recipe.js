const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
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
      required: true,
    },

    cookingTime: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    // Recipe कोणत्या user ने तयार केली
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);