import React, { useEffect, useState } from 'react';
import './style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SendBirdProvider as SBProvider } from "sendbird-uikit";
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProtectedPage from './pages/ProtectedPage';
import ChatPage from "./pages/ChatPage.js";
import { useAuth } from './contexts/AuthContext';
//import './styles/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { APP_ID, USER_ID } from "./constants/sendbird";

export default function App() {
  const { currentUser } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
              <HomePage />
          }
        />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/chat" element={
          // <ProtectedPage>
          <SBProvider appId={APP_ID} userId={USER_ID}>
            <ChatPage/>
          </SBProvider>
          // </ProtectedPage>
        } />
      </Routes>
    </Router>
  );
}
