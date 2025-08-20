import React from "react";
import "../Styling/Components/ComicCard.css";

const ComicCard = ({ image, title, author, year, description }) => {
  const [onReadList, setOnReadList] = React.useState(false);

  const handleReadListToggle = () => {
    setOnReadList((prev) => !prev);
  };

  return (
    <div className="comic-card">
      <div className="comic-card-image">
        <img src={image || "https://via.placeholder.com/220x320"} alt={title} />
      </div>

      <div className="comic-card-overlay">
        <h3 className="comic-card-title">{title}</h3>
        {author && <div className="comic-card-meta">{author}</div>}
        {year && <div className="comic-card-meta">{year}</div>}
        {description && <p className="comic-card-description">{description}</p>}
        <button className="comic-card-button" onClick={handleReadListToggle}>
          {onReadList ? "Remove from Read List" : "Add to Read List"}
        </button>
      </div>
    </div>
  );
};

export default ComicCard;
