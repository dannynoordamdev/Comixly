import { useNavigate } from "react-router-dom";
import "../../Styling/HomeStyling.css";
import React from "react";

function Home() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div className="home-main-content">
        <h1 className="title">StellarSightings</h1>
        <h2 className="subtitle">
          All things Space and cosmic happenings in one place.
        </h2>
        <h3 className="subtitle-followup">
          Track sightings, satellites, and space weather effortlessly.
        </h3>
        <p className="footer-text">Programmed by Dannynoordamdev</p>

        <button className="home-button-to-dashboard" onClick={handleNavigation}>
          Enter the App
        </button>
      </div>
    </>
  );
}

export default Home;
