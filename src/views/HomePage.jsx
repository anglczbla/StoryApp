import React, { useEffect, useState } from 'react';
import StoryPresenter from '../presenters/StoryPresenter';
import StoryItem from '../components/StoryItem';
import MapView from '../components/MapView';

const HomePage = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    StoryPresenter.loadStories(setStories);
  }, []);

  return (
    <main id="main-content">
      <h1>Story List</h1>
      <section>
        {stories.map(story => (
          <StoryItem key={story.id} story={story} />
        ))}
      </section>
      <section>
        <MapView stories={stories} />
      </section>
    </main>
  );
};

export default HomePage;
