import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Profile() {
  const [searchParams] = useSearchParams();

  // URL मधून profile चा email घेणे
  const profileEmail = searchParams.get("email");

  // Login केलेल्या user ची माहिती
  const currentUserEmail = localStorage.getItem("userEmail");
  const currentUserId = localStorage.getItem("userId");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // =========================
  // GET PROFILE
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      // URL मध्ये email नसेल तर logged-in user चा email वापर
      const emailToFetch = profileEmail || currentUserEmail;

      if (!emailToFetch) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/profile/${encodeURIComponent(
            emailToFetch
          )}`
        );

        const data = await response.json();

        if (response.ok) {
          setProfile(data);

          setFollowers(data.followers?.length || 0);
          setFollowing(data.following?.length || 0);

          // Current user या profile ला already follow करतोय का?
          const alreadyFollowing = data.followers?.some(
            (id) => id.toString() === currentUserId
          );

          setIsFollowing(alreadyFollowing || false);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileEmail, currentUserEmail, currentUserId]);

  // =========================
  // FOLLOW USER
  // =========================
  const handleFollow = async () => {
    if (!currentUserId) {
      alert("Please login again");
      return;
    }

    if (!profile?._id) {
      alert("User ID not found");
      return;
    }

    // स्वतःला follow करण्यापासून थांबवणे
    if (currentUserId === profile._id.toString()) {
      alert("You cannot follow yourself");
      return;
    }

    // Already following असल्यास पुन्हा follow करू नये
    if (isFollowing) {
      alert("You are already following this user");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/follow/follow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUserId,
            targetUserId: profile._id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Followed successfully ✅");

        // Target user चे followers +1
        setFollowers((prev) => prev + 1);

        // Button बदलणे
        setIsFollowing(true);
      } else {
        alert(data.message || "Follow failed");
      }
    } catch (error) {
      console.log("Follow error:", error);
      alert("Server error");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Loading Profile...
      </h2>
    );
  }

  // =========================
  // LOGIN CHECK
  // =========================
  if (!currentUserEmail) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Please Login First
      </h2>
    );
  }

  // =========================
  // PROFILE NOT FOUND
  // =========================
  if (!profile) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Profile Not Found
      </h2>
    );
  }

  // =========================
  // CHECK SELF PROFILE
  // =========================
  const isMyProfile =
    currentUserId === profile._id?.toString();

  return (
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        {/* TITLE */}
        <h1>
          {isMyProfile ? "👤 My Profile" : "👤 User Profile"}
        </h1>

        {/* PROFILE IMAGE */}
        {profile.profileImage && (
          <img
            src={profile.profileImage}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "15px",
            }}
          />
        )}

        {/* NAME */}
        <h2>{profile.name}</h2>

        {/* EMAIL */}
        <p>📧 {profile.email}</p>

        {/* BIO */}
        <p>
          {profile.bio || "No bio added yet."}
        </p>

        {/* FOLLOWERS / FOLLOWING */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "50px",
            margin: "25px 0",
          }}
        >
          <div>
            <h3 style={{ margin: "0" }}>
              {followers}
            </h3>

            <p style={{ margin: "5px 0" }}>
              Followers
            </p>
          </div>

          <div>
            <h3 style={{ margin: "0" }}>
              {following}
            </h3>

            <p style={{ margin: "5px 0" }}>
              Following
            </p>
          </div>
        </div>

        {/* FOLLOW BUTTON */}
        {!isMyProfile && (
          <button
            onClick={handleFollow}
            disabled={isFollowing}
            style={{
              padding: "10px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: isFollowing
                ? "default"
                : "pointer",
              fontSize: "16px",
              background: isFollowing
                ? "#ccc"
                : "#4CAF50",
              color: "white",
            }}
          >
            {isFollowing ? "Following ✓" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;