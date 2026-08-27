import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/recipes")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error(error));
  }, []);

  const deleteRecipe = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: "DELETE",
      });

      setRecipes((prev) =>
        prev.filter((recipe) => recipe._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [
    "All",
    ...new Set(
      recipes
        .map((recipe) => recipe.category)
        .filter(Boolean)
    ),
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      recipe.title?.toLowerCase().includes(searchText) ||
      recipe.description?.toLowerCase().includes(searchText) ||
      recipe.ingredients?.toLowerCase().includes(searchText) ||
      recipe.category?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || recipe.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: "30px", background: "#f5f5f5" }}>
      <h1 style={{ textAlign: "center" }}>🍲 All Recipes</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <strong>Filter by Category: </strong>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px", marginLeft: "10px" }}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {filteredRecipes.map((recipe) => (
        <div
          key={recipe._id}
          style={{
            maxWidth: "700px",
            margin: "20px auto",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          )}

          <h2>{recipe.title}</h2>

          <p>{recipe.description}</p>

          <p>
            <strong>Category:</strong> {recipe.category}
          </p>

          <p>
            <strong>Cooking Time:</strong> {recipe.cookingTime} min
          </p>

          <div style={{ marginTop: "15px" }}>
            <Link to={`/recipes/${recipe._id}`}>
              <button
                style={{
                  background: "#ff6b35",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                View Details
              </button>
            </Link>

            <button
              onClick={() => deleteRecipe(recipe._id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Recipes;