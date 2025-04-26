// src/components/StoryItem.jsx
import React from 'react';

const StoryItem = ({ story }) => {
  return (
    <article>
      <img src={story.photoUrl} alt={`Story by ${story.name}`} width="200" />
      <h2>{story.name}</h2>
      <p>{story.description}</p>
      <small>Created At: {new Date(story.createdAt).toLocaleDateString()}</small>
    </article>
  );
};

export default StoryItem;
