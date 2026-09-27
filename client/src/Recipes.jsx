import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const BACKEND_URL =
  "https://recipebox-backend-s0xb.onrender.com";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") || "";

  // ==========================================
  // GET ALL RECIPES
  // ==========================================
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${BACKEND_URL}/api/recipes`
        );

        const data = await response.json();

        console.log("Recipes Response:", data);

        if (response.ok) {
          setRecipes(data);
        } else {
          console.error("Failed to load recipes:", data);
        }
      } catch (error) {
        console.error("Get Recipes Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // ==========================================
  // DELETE RECIPE
  // ==========================================
  const deleteRecipe = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/recipes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Recipe deleted successfully!");

        setRecipes((prev) =>
          prev.filter((recipe) => recipe._id !== id)
        );
      } else {
        alert(data.message || "Failed to delete recipe");
      }
    } catch (error) {
      console.error("Delete Recipe Error:", error);
      alert("Server connection failed");
    }
  };

  // ==========================================
  // CATEGORIES
  // ==========================================
  const categories = [
    "All",
    ...new Set(
      recipes
        .map((recipe) => recipe.category)
        .filter(Boolean)
    ),
  ];

  // ==========================================
  // SEARCH + CATEGORY FILTER
  // ==========================================
  const filteredRecipes = recipes.filter((recipe) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      recipe.title?.toLowerCase().includes(searchText) ||
      recipe.description?.toLowerCase().includes(searchText) ||
      recipe.ingredients?.toLowerCase().includes(searchText) ||
      recipe.category?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      recipe.category === category;

    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading recipes... 🍲</h2>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        🍲 All Recipes
      </h1>

      {/* CATEGORY FILTER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <strong>Filter by Category: </strong>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          style={{
            padding: "8px",
            marginLeft: "10px",
          }}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* NO RECIPES */}
      {filteredRecipes.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
          }}
        >
          <h2>No recipes found 😔</h2>
          <p>Try adding a new recipe.</p>
        </div>
      )}

      {/* RECIPES */}
      {filteredRecipes.map((recipe) => (
        <div
          key={recipe._id}
          style={{
            maxWidth: "700px",
            margin: "20px auto",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* IMAGE */}
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
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          {/* TITLE */}
          <h2>{recipe.title}</h2>

          {/* DESCRIPTION */}
          <p>{recipe.description}</p>

          {/* CATEGORY */}
          <p>
            <strong>Category:</strong>{" "}
            {recipe.category || "Other"}
          </p>

          {/* COOKING TIME */}
          <p>
            <strong>Cooking Time:</strong>{" "}
            {recipe.cookingTime || 0} min
          </p>

          {/* AUTHOR */}
          {recipe.author && (
            <p>
              <strong>Created by:</strong>{" "}
              {recipe.author.name ||
                recipe.author.email ||
                "User"}
            </p>
          )}

          {/* BUTTONS */}
          <div style={{ marginTop: "15px" }}>
            <Link
              to={`/recipes/${recipe._id}`}
            >
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
              onClick={() =>
                deleteRecipe(recipe._id)
              }
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