import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { CsrfContextProvider } from './context/CsrfContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <CsrfContextProvider>
      <App />
    </CsrfContextProvider>
  </AuthContextProvider>
);

