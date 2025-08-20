import React, { useEffect, useState } from "react";
import ComicCard from "../components/ComicCard";
import "../Styling/Components/PopularComics.css";

const PopularComics = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const res = await fetch(
          "https://api.stellarsightings.app/popular-comics"
        );
        if (!res.ok) throw new Error("Failed to fetch popular comics");
        const data = await res.json();
        setResults(data.popular_comics || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  if (loading) return <p>Loading popular comics...</p>;
  if (error) return <p>Error: {error}</p>;
  if (results.length === 0) return <p>No popular comics found.</p>;

  return (
    <div className="comic-card-grid">
      {results.map((comic) => {
        const desc = comic.description || "No description available";
        const shortDesc = desc.length > 30 ? desc.slice(0, 30) + "..." : desc;

        return (
          <ComicCard
            key={comic.id}
            image={comic.image || "https://via.placeholder.com/220x160"}
            title={comic.name}
            author={comic.publisher || "Unknown"}
            year={comic.start_year || "N/A"}
            description={shortDesc}
          />
        );
      })}
    </div>
  );
};

export default PopularComics;
