import React from "react";
import "../Styling/Components/ComicCard.css";
import { useNavigate } from "react-router-dom";
const ComicCard = ({
  id,
  image,
  title,
  author,
  year,
  description,
  className = "",
}) => {
  const [onReadList, setOnReadList] = React.useState(false);
  const navigate = useNavigate();

  const handleReadListToggle = () => {
    setOnReadList((prev) => !prev);
  };

  const handleCardClick = () => {
    if (id) {
      navigate(`/comic/${id}`);
    }
  };

  return (
    <div
      className="comic-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="comic-card-image">
        <img src={image || "https://via.placeholder.com/220x320"} alt={title} />
      </div>

      <div className="comic-card-overlay">
        <h3 className="comic-card-title">{title}</h3>
        {author && <div className="comic-card-meta">{author}</div>}
        {year && <div className="comic-card-meta">{year}</div>}
        <span></span>
        <button className="comic-card-button" onClick={handleReadListToggle}>
          {onReadList ? "Remove from Read List" : "Add to Read List"}
        </button>
      </div>
    </div>
  );
};

export default ComicCard;
