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
import ChatV2Page from './pages/ChatV2Page';
import { useAuth } from './contexts/AuthContext';
//import './styles/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { APP_ID, USER_ID } from "./constants/sendbird";
import { SendBirdProvider } from '@sendbird/uikit-react';
import GroupCall from './pages/GroupCall/GroupCall';
// import { setOnMessageListener, subscribeToPushNotifications } from './util/firebase';

export default function App() {
  const { currentUser: contextUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user)
  }, [contextUser])
  //console.log(currentUser, contextUser)
  // useEffect(() => {
  //   subscribeToPushNotifications();
  //   setOnMessageListener(payload => {
  //     console.log('Message received. ', payload);
  //   })
  // }, [])

  const { email = "", name = "", imageUrl = "" } = currentUser || {}
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
        <Route exact path="/chat-v2" element={
            <ProtectedPage>
              <SendBirdProvider appId={APP_ID} userId={email} nickname={name} profileUrl={imageUrl}>
                <ChatV2Page currentUser={currentUser}/>
              </SendBirdProvider>
            </ProtectedPage>
          }
        />
        <Route exact path="/group-calls" element={
            <ProtectedPage>
              <GroupCall currentUser={currentUser}/>
            </ProtectedPage>
          }
        />
      </Routes>
    </Router>
  );
}
