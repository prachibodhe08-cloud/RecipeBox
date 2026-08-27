import { useEffect, useState } from "react";

function MyFeed() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          alert("Please login first!");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/recipes/feed/${userId}`
        );

        const data = await response.json();

        if (response.ok) {
          setRecipes(data);
        } else {
          alert(data.message || "Failed to load feed");
        }
      } catch (error) {
        console.error("Feed error:", error);
        alert("Server connection failed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading Feed...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>🏠 My Feed</h1>

      {recipes.length === 0 ? (
        <div>
          <h2>No recipes in your feed yet.</h2>
          <p>
            Follow some users to see their recipes here.
          </p>
        </div>
      ) : (
        <div>
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                maxWidth: "600px",
              }}
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
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
                <strong>Cooking Time:</strong>{" "}
                {recipe.cookingTime}
              </p>

              {recipe.author && (
                <p>
                  👤{" "}
                  <strong>
                    {recipe.author.name || recipe.author.email}
                  </strong>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyFeed;