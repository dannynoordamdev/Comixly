import "../../Styling/Components/Profile.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from "react";

function Profile() {
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
    navigate("/dashboard");
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
          <p className="label">You're currently viewing your profile.</p>
          <div className="actions">
            <button onClick={handleProfileReferal}>Dashboard</button>
            <button onClick={handleBlogReferal}>Blog</button>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <div>
              <img
                className="image-container"
                src="defaultProfile.png"
                alt="logo"
              />
            </div>
          </div>
        </div>

        <hr className="content-divider" />

        <div className="grid grid-2">
          <div className="profile-information-card">
            <h2 className="card-title">Profile Information</h2>
            <hr className="content-divider" />
            <div className="profile-information"></div>
          </div>
          <div className="profile-information-card">
            <img
              src={userDetail?.profilePicture || "defaultProfile.png"}
              alt="Profile"
              className="profile-image"
            />
            <div className="profile-image-overlay">
              <span className="edit-icon">Change profile picture ✏️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
