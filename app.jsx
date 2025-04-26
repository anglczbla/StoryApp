import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './views/HomePage';
import AddStoryPage from './views/AddStoryPage';
import { useEffect } from 'react';

useEffect(() => {
  if (document.startViewTransition) {
    document.startViewTransition(() => {});
  }
}, []);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add" element={<AddStoryPage />} />
    </Routes>
  </Router>
);

export default App;
