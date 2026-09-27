import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://recipebox-backend-s0xb.onrender.com";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const myEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BACKEND_URL}/api/profile/users`
      );

      const data = await response.json();

      console.log("USERS API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
        setError("Invalid users data received");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      setError("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (user) => {
    try {
      const myUser = users.find(
        (u) => u.email === myEmail
      );

      if (!myUser) {
        alert("Please login again");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/follow/${user._id}/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUserId: myUser._id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchUsers();
      } else {
        alert(data.message || "Follow failed");
      }
    } catch (error) {
      console.error("Follow error:", error);
      alert("Server error");
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.name || ""} ${user.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
          }}
        />

        {loading && <p>Loading users...</p>}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          filteredUsers.map((user) => (
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
                👥 Followers:{" "}
                {user.followers?.length || 0}
              </p>

              <p>
                👤 Following:{" "}
                {user.following?.length || 0}
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/profile?email=${encodeURIComponent(
                      user.email
                    )}`
                  )
                }
                style={{
                  padding: "10px 20px",
                  marginRight: "10px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                View Profile
              </button>

              {user.email !== myEmail && (
                <button
                  onClick={() => handleFollow(user)}
                  style={{
                    padding: "10px 20px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Follow
                </button>
              )}
            </div>
          ))}

        {!loading &&
          !error &&
          filteredUsers.length === 0 && (
            <p>
              No users found
              {search ? ` for "${search}"` : ""}.
            </p>
          )}
      </div>
    </div>
  );
}

export default Users;