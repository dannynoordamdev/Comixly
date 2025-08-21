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
        const res = await fetch("https://api.comixly.tech/popular-comics");

        if (!res.ok) {
          console.error("Error fetching comics:", res.status);
          setResults([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Popular comics API response:", data);
        setResults(data.popular_comics || []);
      } catch (err) {
        console.error("Error fetching comics:", err);
        setResults([]);
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
      {results.slice(0, 8).map((comic) => (
        <ComicCard
          key={comic.id}
          id={comic.id}
          title={comic.volume_name || comic.title}
          author={comic.title}
          year={comic.cover_date?.slice(0, 4) || "N/A"}
          image={comic.image || "https://via.placeholder.com/220x160"}
          className="comic-card-populair"
        />
      ))}
    </div>
  );
};

export default PopularComics;
