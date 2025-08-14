import "../../Styling/Dashboardstyling.css";
import ISSMap from "./ISSMap";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { userDetail } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } catch (err) {
      setError(err.message);
    }
  };
  const handleProfileReferal = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <div className="information-part">
          <p className="label">Welcome {userDetail.email}</p>
          <div className="actions">
            <button onClick={handleProfileReferal}>Profile</button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <div>
              <img className="image-container" src="vite.svg" alt="" />
            </div>
          </div>
        </div>

        <hr className="content-divider" />

        <div className="grid grid-2">
          <div className="card">
            <h2 className="card-title">A</h2>
          </div>
          <div className="card">
            <h2 className="card-title">Box 2</h2>
          </div>
        </div>

        <hr className="content-divider" />

        <div className="app-status-card">
          <h3 className="card-title">Current running services:</h3>
          <div className="grid grid-4"></div>
        </div>

        <hr className="content-divider" />
      </div>
    </div>
  );
}

export default Dashboard;
