
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// `main.tsx`: point d'entrée React
// - `Provider` fournit le store Redux à toute l'application.
// - `BrowserRouter` active le routing côté client (react-router).
// - `React.StrictMode` aide à repérer des problèmes en développement.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

