import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Note: StrictMode is intentionally not used. The original site's effects
// (loader, carousel loop, counters) are one-shot and StrictMode's dev-only
// double-invocation would replay them.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
