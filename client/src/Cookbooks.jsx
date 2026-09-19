import { Link } from "react-router-dom";
import "./Cookbooks.css";

function Cookbooks() {
  const cookbooks = [
    {
      id: 1,
      name: "Italian Favorites",
      emoji: "🍝",
      description: "Pasta, pizza and delicious Italian recipes",
      recipes: ["Pasta", "Pizza", "Lasagna"],
    },
    {
      id: 2,
      name: "Sweet Treats",
      emoji: "🍰",
      description: "Delicious cakes, brownies and desserts",
      recipes: ["Chocolate Cake", "Brownie", "Cookies"],
    },
    {
      id: 3,
      name: "Healthy Recipes",
      emoji: "🥗",
      description: "Healthy and easy recipes for everyday life",
      recipes: ["Salad", "Oats Bowl", "Grilled Vegetables"],
    },
    {
      id: 4,
      name: "Indian Special",
      emoji: "🇮🇳",
      description: "Popular and tasty Indian recipes",
      recipes: ["Biryani", "Paneer Butter Masala", "Pav Bhaji"],
    },
  ];

  return (
    <div className="cookbook-page">

      <nav className="navbar">
        <div className="logo">🍲 RecipeBox</div>

        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/my-feed">🏠 My Feed</Link>
          <Link to="/cookbooks">📚 Cookbooks</Link>
          <Link to="/add-recipe">➕ Add Recipe</Link>
          <Link to="/users">👥 Users</Link>
          <Link to="/profile">👤 Profile</Link>
        </div>
      </nav>

      <section className="cookbook-header">
        <h1>📚 My Cookbooks</h1>
        <p>Organize your favorite recipes in one place.</p>
      </section>

      <div className="cookbook-grid">

        {cookbooks.map((book) => (
          <div className="cookbook-card" key={book.id}>

            <div className="cookbook-icon">
              {book.emoji}
            </div>

            <h2>{book.name}</h2>

            <p>{book.description}</p>

            <h4>Recipes</h4>

            <ul>
              {book.recipes.map((recipe, index) => (
                <li key={index}>🍴 {recipe}</li>
              ))}
            </ul>

            <button
              onClick={() =>
                alert(
                  `${book.name}\n\nRecipes:\n${book.recipes.join("\n")}`
                )
              }
            >
              View Cookbook
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Cookbooks;