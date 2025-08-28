import React, { useState } from "react";
import ComicCard from "./ComicCard";
import "../Styling/Components/ComicSearch.css";

function ComicSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publisher, setPublisher] = useState("");
  const [generation, setGeneration] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.comixly.tech/comic-series/${encodeURIComponent(
          searchTerm
        )}?limit=50`
      );

      if (!response.ok) {
        console.error("Error fetching comics:", response.status);
        setResults([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResults(data.volumes || []);
    } catch (error) {
      console.error("Error fetching comics:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="comic-search-container">
        <div className="search-header">
          <input
            type="text"
            placeholder="Search for new comic series..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          >
            <option value="">All Publishers</option>
            <option value="Marvel">Marvel</option>
            <option value="DC">DC</option>
            <option value="Dark Horse">Dark Horse</option>
            <option value="IDW">IDW</option>
            <option value="Dynamite">Dynamite</option>
            <option value="BOOM! Studios">BOOM! Studios</option>
            <option value="Image">Image</option>
          </select>
          <button className="button-search" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="search-results">
          {loading && <p>Loading...</p>}

          {!loading &&
            results.map((comic) => {
              const desc = comic.description || "No description available";
              return (
                <ComicCard
                  key={comic.id}
                  image={comic.image || "https://via.placeholder.com/220x160"}
                  title={comic.name}
                  language={comic.language || "Unknown"}
                  author={comic.publisher || "Unknown"}
                  year={comic.start_year || "N/A"}
                  className="comic-card-search"
                />
              );
            })}
        </div>{" "}
      </div>
    </div>
  );
}

export default ComicSearch;
