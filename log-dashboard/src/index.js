// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // if using Tailwind or your global CSS
import App from './App.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
