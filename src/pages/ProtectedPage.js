import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedPage({ children }) {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (!currentUser) return <Navigate to="/login" />;
  return children;
}
