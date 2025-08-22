import React, { useState } from "react";
import ComicCard from "./ComicCard";
import "../Styling/Components/Library.css";

function Library() {
  return (
    <div>
      <div className="comic-search-container"></div>
      <div className="library-container">
        <p>No Libraries yet.</p>
      </div>
    </div>
  );
}

export default Library;
