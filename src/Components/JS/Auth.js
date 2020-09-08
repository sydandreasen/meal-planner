import React, { useEffect, useState } from "react";
import application from "./Firebase.js";
import { app } from "firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  // initial null user
  const [currentUser, setCurrentUser] = useState(null);

  // when authentication state changes, set the user
  useEffect(() => {
    application.auth().onAuthStateChanged(setCurrentUser);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
