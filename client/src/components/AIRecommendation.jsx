import React from "react";

const allComics = [
  { id: 1, title: "Galactic Adventures" },
  { id: 2, title: "Stellar Knights" },
  { id: 3, title: "Cosmic Crusaders" },
  { id: 4, title: "Nebula Navigators" },
  { id: 5, title: "Astro Agents" },
];

const userSubscribedComicIds = [1, 3];

function getRecommendations(subscribedIds, comics) {
  return comics.filter((comic) => !subscribedIds.includes(comic.id));
}

const AIRecommendation = () => {
  const recommendations = getRecommendations(userSubscribedComicIds, allComics);

  return (
    <div>
      {recommendations.length === 0 ? (
        <p>No new recommendations. You're subscribed to all comics!</p>
      ) : (
        <ul>
          {recommendations.map((comic) => (
            <li key={comic.id}>{comic.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AIRecommendation;
