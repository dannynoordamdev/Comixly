import "../../Styling/ComicPage.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from "react";

function ComicDetails() {
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

  const handleDashboardReferal = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="comicpage-wrapper">
      <div className="comicpage-card">
        {/* Header */}
        <div className="comicpage-information-part">
          <p className="label">
            Welcome
            {userDetail?.email
              ? `, ${userDetail.email}`
              : ". Please update your profile."}
          </p>
          <div className="actions">
            <button onClick={handleDashboardReferal}>Dashboard</button>
            <button onClick={handleProfileReferal}>Profile</button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <div>
              <img className="image-container" src="vite.svg" alt="logo" />
            </div>
          </div>
        </div>

        <hr className="content-divider" />
        <div className="grid comic-grid">
          <div className="card">
            <h2 className="card-title">Title of Comic</h2>
            <img src="" alt="comic cover" />
            <p className="card-description">
              This is a brief summary of the comic's storyline, characters, and
              themes.
            </p>
            <div className="tags">
              <span className="tag">Action</span>
              <span className="tag">Adventure</span>
              <span className="tag">Fantasy</span>
            </div>
          </div>

          <div className="card right-card">
            <h2 className="card-title">Issues</h2>
            <p>
              List of comic issues, chapters, or additional info can go here.
            </p>
          </div>

          <div className="card">
            <h2 className="card-title">AI Recommendations</h2>
            <p>Suggestions for comics based on your reading history.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComicDetails;
