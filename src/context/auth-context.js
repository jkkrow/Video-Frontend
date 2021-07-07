import { createContext, useState, useCallback } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("user"))?.token || ""
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))?.userData || {}
  );

  const loginHandler = useCallback((token, userData) => {
    setToken(token);
    setUserData(userData);

    localStorage.setItem("user", JSON.stringify({ token, userData }));
  }, []);

  const logoutHandler = useCallback(() => {
    setToken("");
    setUserData({});

    localStorage.removeItem("user");
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
