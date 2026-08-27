import { useState } from "react";

function AddRecipe() {
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    category: "",
    cookingTime: "",
    image: "",
  });

  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please login first!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/recipes/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...recipe,
            author: userId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Recipe added successfully!");

        setRecipe({
          title: "",
          description: "",
          ingredients: "",
          instructions: "",
          category: "",
          cookingTime: "",
          image: "",
        });
      } else {
        alert(data.message || "Failed to add recipe");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "auto" }}>
      <h1>🍲 Add New Recipe</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Recipe Title"
          value={recipe.title}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Recipe Description"
          value={recipe.description}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <textarea
          name="ingredients"
          placeholder="Ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <textarea
          name="instructions"
          placeholder="Cooking Instructions"
          value={recipe.instructions}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="category"
          placeholder="Category (Breakfast, Lunch, Dessert...)"
          value={recipe.category}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="cookingTime"
          placeholder="Cooking Time (e.g. 30 minutes)"
          value={recipe.cookingTime}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="url"
          name="image"
          placeholder="Recipe Image URL"
          value={recipe.image}
          onChange={handleChange}
        />

        <br />
        <br />

        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}

export default AddRecipe;