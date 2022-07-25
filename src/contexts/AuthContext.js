import React, { useContext, useState, useEffect } from 'react';
import { auth, getUser } from '../util/firebase';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import useMounted from '../hooks/useMounted';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const isMounted = useMounted();
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function otherLogin(email){
      const [data, err] = await getUser(email);
      // if(data.length){
      //   setCurrentUser(data[0]);
      //   localStorage.setItem('user', JSON.stringify(data[0]));
      //   localStorage.setItem("userType", "other-user");
      // }
      return [data, err, setCurrentUser];
  }

  function logout() {
    localStorage.setItem('user', null);
    localStorage.setItem("userType", null);
    isMounted && setCurrentUser(null)
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(localStorage.getItem("userType") !== "other-user"){
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    otherLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
