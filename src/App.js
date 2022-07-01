import React, { useEffect, useState } from 'react';
import './style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SendBirdProvider as SBProvider } from "sendbird-uikit";
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OtherLoginPage from "./pages/OtherLoginPage";
import ProtectedPage from './pages/ProtectedPage';
import ChatPage from "./pages/ChatPage.js";
import DirectCallsPage from './pages/DirectCallsPage';
import { useAuth } from './contexts/AuthContext';
//import './styles/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { APP_ID, USER_ID } from "./constants/sendbird";

export default function App() {
  //const { currentUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user)
  }, [])
  const { email = "", name = "", imageUrl = null } = currentUser || {}
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />}/>
        <Route exact path="/signup" element={<SignupPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/login-other" element={<OtherLoginPage/>} />
        <Route exact path="/chat" element={
            <ProtectedPage>
              <SBProvider appId={APP_ID} userId={email} nickname={name} profileUrl={imageUrl}>
                <ChatPage currentUser={currentUser} />
              </SBProvider>
            </ProtectedPage>
          }
        />
        <Route exact path="/direct-calls" element={
            <ProtectedPage>
                <DirectCallsPage currentUser={currentUser}/>
            </ProtectedPage>
          }
        />
      </Routes>
    </Router>
  );
}
