import React from 'react';
import './style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProtectedPage from './pages/ProtectedPage';
import { useAuth } from './contexts/AuthContext';
//import './styles/bootstrap.min.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
export default function App() {
  const { currentUser } = useAuth();
  //console.log(currentUser);
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ProtectedPage currentUser={currentUser}>
              <HomePage />
            </ProtectedPage>
          }
        />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route exact path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
