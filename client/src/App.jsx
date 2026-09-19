import "./App.css";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Profile from "./Profile";
import Users from "./Users";

import AddRecipe from "./AddRecipe";
import Recipes from "./Recipes";
import RecipeDetails from "./RecipeDetails";

import MyFeed from "./pages/Myfeed";
import Cookbooks from "./Cookbooks";


// ================= HOME PAGE =================

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim() !== "") {
      navigate(`/recipes?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo">
          🍲 RecipeBox
        </div>

        <div className="nav-links">

          <Link to="/home">
            Home
          </Link>

          <Link to="/recipes">
            Recipes
          </Link>

          <Link to="/my-feed">
            🏠 My Feed
          </Link>

          <Link to="/cookbooks">
            📚 Cookbooks
          </Link>

          <Link to="/add-recipe">
            ➕ Add Recipe
          </Link>

          <Link to="/users">
            👥 Users
          </Link>

          <Link to="/profile">
            👤 Profile
          </Link>

        </div>

      </nav>


      {/* HERO SECTION */}

      <section className="hero">

        <h1>
          Discover. Cook. Share. Repeat.
        </h1>

        <p>
          Discover delicious recipes and share your favorite dishes.
        </p>


        {/* SEARCH */}

        <form onSubmit={handleSearch} className="search-box">

          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">
            🔍 Search
          </button>

        </form>

      </section>


      {/* TRENDING RECIPES */}

      <section className="trending">

        <h2>
          🔥 Trending Recipes
        </h2>


        <div className="recipe-cards">


          {/* BIRYANI */}

          <div className="recipe-card">

            <img
              src="https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=800&q=80"
              alt="Chicken Biryani"
            />

            <h3>
              Chicken Biryani
            </h3>

            <p>
              Spicy and delicious Indian biryani.
            </p>

          </div>


          {/* PIZZA */}

          <div className="recipe-card">

            <img
              src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80"
              alt="Veg Pizza"
            />

            <h3>
              Veg Pizza
            </h3>

            <p>
              Cheesy and tasty vegetable pizza.
            </p>

          </div>


          {/* CAKE */}

          <div className="recipe-card">

            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
              alt="Chocolate Cake"
            />

            <h3>
              Chocolate Cake
            </h3>

            <p>
              Soft and delicious chocolate cake.
            </p>

          </div>


        </div>

      </section>

    </div>
  );
}


// ================= MAIN APP =================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* SIGNUP */}

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* HOME */}

        <Route
          path="/home"
          element={<Home />}
        />


        {/* PROFILE */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* USERS */}

        <Route
          path="/users"
          element={<Users />}
        />


        {/* RECIPES */}

        <Route
          path="/recipes"
          element={<Recipes />}
        />


        {/* RECIPE DETAILS */}

        <Route
          path="/recipes/:id"
          element={<RecipeDetails />}
        />


        {/* ADD RECIPE */}

        <Route
          path="/add-recipe"
          element={<AddRecipe />}
        />


        {/* MY FEED */}

        <Route
          path="/my-feed"
          element={<MyFeed />}
        />


        {/* COOKBOOKS */}

        <Route
          path="/cookbooks"
          element={<Cookbooks />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;