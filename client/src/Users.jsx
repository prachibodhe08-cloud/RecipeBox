import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/profile"
        );

        const data = await response.json();

        if (response.ok) {
          setUsers(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log("Users error:", error);
      }
    };

    fetchUsers();
  }, []);

  // Follow User
  const handleFollow = async (userId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/follow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            followerId: loggedInUserId,
            followingId: userId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Follow successful!");

        // Users पुन्हा fetch करणे
        const usersResponse = await fetch(
          "http://localhost:5000/api/profile"
        );

        const usersData = await usersResponse.json();

        if (usersResponse.ok) {
          setUsers(usersData);
        }
      } else {
        alert(data.message || "Server error");
      }
    } catch (error) {
      console.log("Follow error:", error);
      alert("Server error");
    }
  };

  // Search by Name OR Email
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText)
    );
  });

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
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <h1>👥 Find Users</h1>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search user by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            boxSizing: "border-box",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
          }}
        />

        {/* Users */}
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            style={{
              background: "white",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>{user.name || "No Name"}</h2>

            <p>📧 {user.email}</p>

            <p>
              👥 Followers: {user.followers?.length || 0}
            </p>

            <p>
              👤 Following: {user.following?.length || 0}
            </p>

            <button
              onClick={() =>
                navigate(
                  `/profile?email=${encodeURIComponent(user.email)}`
                )
              }
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              View Profile
            </button>

            {/* Follow Button */}
            {user._id !== loggedInUserId && (
              <button
                onClick={() => handleFollow(user._id)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: "#007bff",
                  color: "white",
                }}
              >
                Follow
              </button>
            )}
          </div>
        ))}

        {/* No Users */}
        {filteredUsers.length === 0 && (
          <p>
            {search
              ? `No users found for "${search}"`
              : "No users found."}
          </p>
        )}
      </div>
    </div>
  );
}

export default Users;