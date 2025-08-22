import "../../Styling/DashboardStyling.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ComicSearch from "../ComicSearch";
import AIRecommendation from "../AIRecommendation";
import PopularComics from "../PopularComics";
import Library from "../Library";
import React from "react";

function Dashboard() {
  const { userDetail, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleProfileReferal = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  const handleBlogReferal = (e) => {
    e.preventDefault();
    window.location.href = "https://blog.comixly.tech";
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        {/* Header */}
        <div className="information-part">
          <p className="label">
            Welcome
            {userDetail?.username
              ? `, ${userDetail.username}`
              : `, ${userDetail.email}`}
          </p>
          <div className="actions">
            <button onClick={handleProfileReferal}>Profile</button>
            <button onClick={handleBlogReferal}>Blog</button>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <div>
              <img className="image-container" src="vite.svg" alt="logo" />
            </div>
          </div>
        </div>

        <hr className="content-divider" />

        <div className="grid grid-2">
          <div className="card">
            <h2 className="card-title">Comixly Recommends:</h2>
            <p className="card-description">
              Based on your reading history, Comixly AI recommends these comics.
            </p>
            <hr />

            <div className="recommended-comics">
              <AIRecommendation />
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Popular Today:</h2>
            <PopularComics />
          </div>
        </div>
        <div className="grid grid-1">
          <div className="card">
            <h2 className="card-title">Your Library:</h2>
            <p className="card-description">
              View your saved comics and reading history.
            </p>
            <Library />
          </div>
        </div>
        <div className="grid grid-1">
          <div className="card">
            <h2 className="card-title">Comic Series</h2>
            <ComicSearch />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
