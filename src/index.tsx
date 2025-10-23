import { initTheme } from './utils/theme';
import '../styles/reset.css';
import '../styles/theme.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
initTheme();
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
