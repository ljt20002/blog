import { initTheme } from './utils/theme';
import '../styles/reset.css';
import '../styles/theme.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from '@/i18n';
initTheme();
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <I18nProvider>
        <App />
      </I18nProvider>
    </React.StrictMode>,
  );
}
