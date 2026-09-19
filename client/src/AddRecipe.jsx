import { useState } from "react";

function AddRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://recipebox-backend-s0xb.onrender.com/api/recipes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            ingredients,
            instructions,
            category,
            cookingTime,
            image,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Recipe added successfully!");

        // Clear form
        setTitle("");
        setDescription("");
        setIngredients("");
        setInstructions("");
        setCategory("");
        setCookingTime("");
        setImage("");
      } else {
        alert(data.message || "Failed to add recipe");
      }
    } catch (error) {
      console.error("Add Recipe Error:", error);
      alert("Server connection failed");
    }
  };

  return (
    <div className="add-recipe-page">
      <div className="add-recipe-card">

        <h1>🍲 Add Recipe</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Recipe Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Recipe Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <textarea
            placeholder="Ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />

          <textarea
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Italian">Italian</option>
            <option value="Indian">Indian</option>
            <option value="Chinese">Chinese</option>
            <option value="Dessert">Dessert</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            placeholder="Cooking Time (minutes)"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button type="submit">
            Add Recipe
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddRecipe;