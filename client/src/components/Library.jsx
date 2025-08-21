import React, { useState } from "react";
import ComicCard from "./ComicCard";
import "../Styling/Components/Library.css";

function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [readingStatus, setReadingStatus] = useState("Unread");

  return (
    <div>
      <div className="comic-search-container">
        <input
          type="text"
          placeholder="Search for comic series..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={readingStatus}
          onChange={(e) => setReadingStatus(e.target.value)}
        >
          <option value="Unread">Unread</option>
          <option value="Reading">Reading</option>
          <option value="Read">Read</option>
        </select>
      </div>
    </div>
  );
}

export default Library;
