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
        <h1 className="title">Comixly.</h1>
        <h2 className="subtitle">
          All things comics and graphic novels in one place.
        </h2>
        <h3 className="subtitle-followup">
          Track your favorite series, authors, and new releases effortlessly.
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
