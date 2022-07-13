import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import AuthProvider from './contexts/AuthContext';
import App from './App';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
  rootElement
);
