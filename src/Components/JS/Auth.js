import React, { useEffect, useState } from "react";
import base from "./Firebase.js";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  // initial null user
  const [currentUser, setCurrentUser] = useState(null);

  // pending to await the setting of currentUser
  const [pending, setPending] = useState(true);

  // when authentication state changes, set the user
  useEffect(() => {
    base.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false); // pending = false after setCurrentUserComplete, allows proper AuthContext.Provided return
    });
  }, []);

  // hasn't updated auth state yet
  if (pending) {
    return <div></div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
