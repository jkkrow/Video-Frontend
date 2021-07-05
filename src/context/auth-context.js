import { createContext, useState, useCallback } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("user"))?.token || ""
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const loginHandler = useCallback(() => {
    setToken();
    setUserData();
  }, []);

  const logoutHandler = useCallback(() => {
    setToken();
    setUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        loginHandler,
        logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
