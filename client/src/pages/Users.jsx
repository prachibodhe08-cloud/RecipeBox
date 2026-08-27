import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const myEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/profile"
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (user) => {
    try {
      // माझा user शोधतो
      const myUser = users.find(
        (u) => u.email === myEmail
      );

      if (!myUser) {
        alert("Please login again");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/follow/${user._id}/follow`,
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
      console.log("Follow error:", error);
      alert("Server error");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name
      ?.toLowerCase()
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
          placeholder="Search user..."
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

        {filteredUsers.map((user) => (
          <div
            key={user._id}
            style={{
              background: "white",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "10px",
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

        {filteredUsers.length === 0 && (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default Users;