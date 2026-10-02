import React, { useEffect, useState } from "react";
import axios from "axios";

function MyFeed() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyFeed();
  }, []);

  const fetchMyFeed = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      // Check login
      if (!userId) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      // Render backend API
      const response = await axios.get(
        `https://recipebox-backend-s0xb.onrender.com/api/recipes/feed/${userId}`
      );

      console.log("My Feed Response:", response.data);

      // Make sure response is an array
      if (Array.isArray(response.data)) {
        setRecipes(response.data);
      } else {
        setRecipes([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("My Feed Error:", error);

      if (error.response) {
        console.error("Server Response:", error.response.data);
        console.error("Status:", error.response.status);
      }

      setError("Unable to load My Feed.");
      setRecipes([]);
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading My Feed...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        backgroundColor: "#f8f8f8",
      }}
    >
      <h1>My Feed</h1>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "15px",
            marginTop: "15px",
            backgroundColor: "#ffe5e5",
            border: "1px solid #ff9999",
            borderRadius: "8px",
          }}
        >
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Empty Feed */}
      {!error && recipes.length === 0 && (
        <div
          style={{
            padding: "20px",
            marginTop: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        >
          <h3>No recipes found in your feed.</h3>
          <p>
            Follow some users to see their recipes here.
          </p>
        </div>
      )}

      {/* Recipes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {/* Recipe Image */}
            {recipe.image && (
              <img
                src={recipe.image}
                alt={recipe.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}

            {/* Recipe Title */}
            <h2>{recipe.title}</h2>

            {/* Description */}
            {recipe.description && (
              <p>{recipe.description}</p>
            )}

            {/* Category */}
            <p>
              <b>Category:</b>{" "}
              {recipe.category || "Other"}
            </p>

            {/* Cooking Time */}
            <p>
              <b>Cooking Time:</b>{" "}
              {recipe.cookingTime || 0} minutes
            </p>

            {/* Author */}
            {recipe.author && (
              <p>
                <b>Author:</b>{" "}
                {recipe.author.name ||
                  recipe.author.email ||
                  "Unknown"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFeed;

