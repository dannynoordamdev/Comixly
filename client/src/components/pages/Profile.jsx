import "../../Styling/DashboardStyling.css";
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

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        {/* Header */}
        <div className="information-part">
          <p className="label">
            Welcome
            {userDetail?.email
              ? `, ${userDetail.email}`
              : ". Please update your profile."}{" "}
          </p>
          <div className="actions">
            <button onClick={handleProfileReferal}>Dashboard</button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <div>
              <img className="image-container" src="vite.svg" alt="logo" />
            </div>
          </div>
        </div>

        <hr className="content-divider" />

        <div className="grid grid-1">
          <div className="card">
            <h2 className="card-title"></h2>
          </div>

          <div className="card">
            <h2 className="card-title"></h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
