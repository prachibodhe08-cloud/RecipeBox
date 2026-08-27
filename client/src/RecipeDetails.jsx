import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RecipeDetails() {
  const { id } = useParams();

  // Recipe
  const [recipe, setRecipe] = useState(null);

  // Comments
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");

  // Rating
  const [selectedRating, setSelectedRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  // Loading
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH RECIPE
  // =====================================================

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/recipes/${id}`
        );

        const data = await response.json();

        if (response.ok) {
          setRecipe(data);
        } else {
          alert("Recipe not found");
        }
      } catch (error) {
        console.error("Recipe fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // =====================================================
  // FETCH COMMENTS
  // =====================================================

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${id}`
      );

      const data = await response.json();

      if (response.ok) {
        setComments(data);
      } else {
        console.log("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Comments fetch error:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // =====================================================
  // FETCH RATINGS
  // =====================================================

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ratings/${id}`
      );

      const data = await response.json();

      if (response.ok) {
        setAverageRating(data.averageRating || 0);
        setTotalRatings(data.totalRatings || 0);
      } else {
        console.log("Failed to fetch ratings");
      }
    } catch (error) {
      console.error("Ratings fetch error:", error);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [id]);

  // =====================================================
  // ADD COMMENT
  // =====================================================

  const addComment = async () => {
    if (!userName.trim() || !commentText.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/comments",
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

        fetchComments();
      } else {
        alert(data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Comment error:", error);

      alert("Server error");
    }
  };

  // =====================================================
  // SUBMIT RATING
  // =====================================================

  const submitRating = async () => {
    // Check rating
    if (selectedRating === 0) {
      alert("Please select a rating");
      return;
    }

    // Check name
    if (!userName.trim()) {
      alert("Please enter your name before rating");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/ratings",
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
        // ==========================================
        // UPDATE RATING IMMEDIATELY
        // ==========================================

        const oldTotal = totalRatings;
        const oldAverage = averageRating;

        const newTotal = oldTotal + 1;

        const newAverage =
          (oldAverage * oldTotal + selectedRating) /
          newTotal;

        setTotalRatings(newTotal);

        setAverageRating(
          Number(newAverage.toFixed(1))
        );

        // Reset selected star
        setSelectedRating(0);

        alert("Rating Added Successfully ⭐");
      } else {
        alert(
          data.message || "Failed to add rating"
        );
      }
    } catch (error) {
      console.error("Rating error:", error);

      alert("Server error");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        Loading...
      </h2>
    );
  }

  // =====================================================
  // RECIPE NOT FOUND
  // =====================================================

  if (!recipe) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        Recipe not found
      </h2>
    );
  }

  // =====================================================
  // YOUTUBE VIDEO URL
  // =====================================================

  const getYouTubeEmbedUrl = (url) => {
    if (!url) {
      return "";
    }

    try {
      const videoUrl = new URL(url);

      // youtube.com/watch?v=VIDEO_ID
      if (videoUrl.hostname.includes("youtube.com")) {
        const videoId =
          videoUrl.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // youtu.be/VIDEO_ID
      if (videoUrl.hostname.includes("youtu.be")) {
        const videoId =
          videoUrl.pathname.substring(1);

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    } catch (error) {
      console.error("Invalid video URL");
    }

    return "";
  };

  const videoUrl = getYouTubeEmbedUrl(
    recipe.videoUrl
  );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* =================================================
          RECIPE TITLE
      ================================================= */}

      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        {recipe.title}
      </h1>

      {/* =================================================
          RECIPE IMAGE
      ================================================= */}

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

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <h2>📝 Description</h2>

      <p
        style={{
          lineHeight: "1.6",
        }}
      >
        {recipe.description}
      </p>

      {/* =================================================
          CATEGORY
      ================================================= */}

      <p>
        <strong>Category:</strong>{" "}
        {recipe.category || "Not specified"}
      </p>

      {/* =================================================
          COOKING TIME
      ================================================= */}

      <p>
        <strong>⏱ Cooking Time:</strong>{" "}
        {recipe.cookingTime || "Not specified"}
      </p>

      {/* =================================================
          INGREDIENTS
      ================================================= */}

      <h2>🥕 Ingredients</h2>

      <p
        style={{
          whiteSpace: "pre-line",
          lineHeight: "1.7",
        }}
      >
        {recipe.ingredients}
      </p>

      {/* =================================================
          INSTRUCTIONS
      ================================================= */}

      <h2>👩‍🍳 Instructions</h2>

      <p
        style={{
          whiteSpace: "pre-line",
          lineHeight: "1.7",
        }}
      >
        {recipe.instructions}
      </p>

      {/* =================================================
          COOKING VIDEO
      ================================================= */}

      {videoUrl && (
        <div
          style={{
            marginTop: "30px",
          }}
        >
          <h2>🎥 Cooking Video</h2>

          <iframe
            width="100%"
            height="450"
            src={videoUrl}
            title="Cooking Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: "12px",
            }}
          ></iframe>
        </div>
      )}

      {/* =================================================
          RATING SECTION
      ================================================= */}

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

        {/* Average Rating */}

        <h3
          style={{
            fontSize: "28px",
            marginBottom: "5px",
          }}
        >
          ⭐ {averageRating} / 5
        </h3>

        <p>
          Based on{" "}
          <strong>{totalRatings}</strong>{" "}
          {totalRatings === 1
            ? "rating"
            : "ratings"}
        </p>

        {/* Your Rating */}

        <h3>Your Rating:</h3>

        {/* Stars */}

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
              onClick={() =>
                setSelectedRating(star)
              }
              style={{
                cursor: "pointer",

                color:
                  star <= selectedRating
                    ? "#f5b301"
                    : "#ccc",

                transition:
                  "color 0.2s",
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Selected Rating */}

        {selectedRating > 0 && (
          <p
            style={{
              fontSize: "18px",
            }}
          >
            You selected{" "}
            <strong>
              {selectedRating} / 5
            </strong>
          </p>
        )}

        {/* User Name */}

        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) =>
            setUserName(e.target.value)
          }
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

        {/* Submit Rating */}

        <button
          onClick={submitRating}
          style={{
            padding: "12px 25px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            background: "#f5b301",
            color: "white",
          }}
        >
          Submit Rating
        </button>
      </div>

      {/* =================================================
          COMMENTS SECTION
      ================================================= */}

      <div
        style={{
          marginTop: "40px",
        }}
      >
        <h2>💬 Comments</h2>

        {/* Comment Name */}

        <input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) =>
            setUserName(e.target.value)
          }
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

        {/* Comment Text */}

        <textarea
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) =>
            setCommentText(e.target.value)
          }
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
        ></textarea>

        {/* Add Comment Button */}

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

        {/* =================================================
            COMMENTS LIST
        ================================================= */}

        <div
          style={{
            marginTop: "25px",
          }}
        >
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                style={{
                  borderBottom:
                    "1px solid #ddd",
                  padding: "15px 0",
                }}
              >
                <strong>
                  {comment.userName}
                </strong>

                <p
                  style={{
                    margin: "5px 0",
                  }}
                >
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