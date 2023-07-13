import React, { createContext, useContext, useEffect, useState } from "react";
import safelyParseJson from "../utils";

// export default createContext({
const AuthContext = createContext({
  token: null,
  userId: null,
  login: () => {},
  logout: () => {},
});

const INITIAL_AUTH_STATE = {
  token: null,
  userId: null,
};

// export const useAuth = useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(INITIAL_AUTH_STATE);
  const login = (userId, token, _tokenExpiration) => {
    localStorage.setItem("auth", JSON.stringify({ userId, token }));
    setAuthState((prevState) => ({ ...prevState, token, userId }));
  };

  const logout = () => {
    setAuthState(INITIAL_AUTH_STATE);
  };

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parsedData = safelyParseJson(data);
      setAuthState({ ...parsedData });
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        // token: authState.token,
        // userId: authState.userId,
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
