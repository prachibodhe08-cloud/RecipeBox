import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BACKEND_URL = "https://recipebox-backend-s0xb.onrender.com";

function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);

  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");

  const [selectedRating, setSelectedRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH RECIPE
  // =========================
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/recipes/${id}`
        );

        const data = await response.json();

        if (response.ok) {
          setRecipe(data);
        } else {
          console.log("Recipe error:", data);
          setRecipe(null);
        }
      } catch (error) {
        console.error("Recipe fetch error:", error);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // =========================
  // FETCH COMMENTS
  // =========================
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/comments/${id}`
      );

      const data = await response.json();

      if (response.ok) {
        setComments(data);
      } else {
        console.log("Comments error:", data);
      }
    } catch (error) {
      console.error("Comments fetch error:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // =========================
  // FETCH RATINGS
  // =========================
  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/ratings/${id}`
      );

      const data = await response.json();

      if (response.ok) {
        setAverageRating(data.averageRating || 0);
        setTotalRatings(data.totalRatings || 0);
      } else {
        console.log("Ratings error:", data);
      }
    } catch (error) {
      console.error("Ratings fetch error:", error);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [id]);

  // =========================
  // ADD COMMENT
  // =========================
  const addComment = async () => {
    if (!userName.trim() || !commentText.trim()) {
      alert("Please enter your name and comment");
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeId: id,
            userName: userName.trim(),
            commentText: commentText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Comment added successfully 💬");

        setCommentText("");

        await fetchComments();
      } else {
        alert(data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Comment error:", error);
      alert("Server connection error");
    }
  };

  // =========================
  // SUBMIT RATING
  // =========================
  const submitRating = async () => {
    if (selectedRating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!userName.trim()) {
      alert("Please enter your name before rating");
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeId: id,
            userName: userName.trim(),
            rating: selectedRating,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Rating added successfully ⭐");

        setSelectedRating(0);

        await fetchRatings();
      } else {
        alert(data.message || "Failed to add rating");
      }
    } catch (error) {
      console.error("Rating error:", error);
      alert("Server connection error");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </h2>
    );
  }

  // =========================
  // RECIPE NOT FOUND
  // =========================
  if (!recipe) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Recipe not found
      </h2>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        {recipe.title}
      </h1>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            maxHeight: "450px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        />
      )}

      <h2>📝 Description</h2>

      <p style={{ lineHeight: "1.6" }}>
        {recipe.description}
      </p>

      <p>
        <strong>Category:</strong>{" "}
        {recipe.category || "Not specified"}
      </p>

      <p>
        <strong>⏱ Cooking Time:</strong>{" "}
        {recipe.cookingTime || "Not specified"} minutes
      </p>

      <h2>🥕 Ingredients</h2>

      <p
        style={{
          whiteSpace: "pre-line",
          lineHeight: "1.7",
        }}
      >
        {recipe.ingredients}
      </p>

      <h2>👩‍🍳 Instructions</h2>

      <p
        style={{
          whiteSpace: "pre-line",
          lineHeight: "1.7",
        }}
      >
        {recipe.instructions}
      </p>

      {/* =========================
          RATING
      ========================= */}

      <div
        style={{
          marginTop: "40px",
          padding: "25px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <h2>⭐ Recipe Rating</h2>

        <h3 style={{ fontSize: "28px" }}>
          ⭐ {averageRating} / 5
        </h3>

        <p>
          Based on <strong>{totalRatings}</strong>{" "}
          {totalRatings === 1 ? "rating" : "ratings"}
        </p>

        <h3>Your Rating:</h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            fontSize: "40px",
            marginBottom: "10px",
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setSelectedRating(star)}
              style={{
                cursor: "pointer",
                color:
                  star <= selectedRating
                    ? "#f5b301"
                    : "#ccc",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            fontSize: "16px",
          }}
        />

        <button
          onClick={submitRating}
          style={{
            padding: "12px 25px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit Rating
        </button>
      </div>

      {/* =========================
          COMMENTS
      ========================= */}

      <div style={{ marginTop: "40px" }}>
        <h2>💬 Comments</h2>

        <textarea
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="4"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            fontSize: "16px",
          }}
        />

        <button
          onClick={addComment}
          style={{
            padding: "12px 25px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Add Comment
        </button>

        <div style={{ marginTop: "25px" }}>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "15px 0",
                }}
              >
                <strong>{comment.userName}</strong>

                <p style={{ margin: "5px 0" }}>
                  {comment.commentText}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;