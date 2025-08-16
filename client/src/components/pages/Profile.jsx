import "../../Styling/Profilestyling.css";
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
  const handleDashboardReferal = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-information-part">
          <p className="label">Welcome {userDetail.email}</p>
          <div className="actions">
            <button onClick={handleDashboardReferal}>Dashboard</button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <div>
              <img className="image-container" src="vite.svg" alt="" />
            </div>
          </div>
        </div>

        <hr className="content-divider" />

        <div className="grid grid-1">
          <div className="card">
            <h2 className="card-title">
              Future Profile CRUD actions come here!
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
