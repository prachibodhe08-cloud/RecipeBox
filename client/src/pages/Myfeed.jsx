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
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/recipes/feed/${userId}`
      );

      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Unable to load My Feed.");
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading My Feed...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Feed</h1>

      {error && <p>{error}</p>}

      {!error && recipes.length === 0 && (
        <p>No recipes found in your feed.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
              background: "#fff",
            }}
          >
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

            <h2>{recipe.title}</h2>

            <p>{recipe.description}</p>

            <p>
              <b>Category:</b> {recipe.category}
            </p>

            <p>
              <b>Cooking Time:</b> {recipe.cookingTime} minutes
            </p>

            {recipe.author && (
              <p>
                <b>Author:</b>{" "}
                {recipe.author.name || recipe.author.email}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFeed;