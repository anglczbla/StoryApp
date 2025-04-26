import React from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './src/views/HomePage.jsx'; // Pastikan path sesuai!

const root = createRoot(document.getElementById('main-content'));
root.render(<HomePage />);
