import React, { useEffect, useState } from "react";
import application from "./Firebase.js";
// import { Spin } from "antd";
// import { loadingMessage } from "./Commons.js";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  // initial null user
  const [currentUser, setCurrentUser] = useState(null);

  // pending to await the setting of currentUser
  const [pending, setPending] = useState(true);

  // when authentication state changes, set the user
  useEffect(() => {
    application.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false); // pending = false after setCurrentUserComplete, allows proper AuthContext.Provided return
    });
  }, []);

  if (pending) {
    // let message = loadingMessage();
    // console.log(message);
    return (
      <div>
        {/* <p>{message}</p>
        <Spin size={"large"} spinning={true} /> */}
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
