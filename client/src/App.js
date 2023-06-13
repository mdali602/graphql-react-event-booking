import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Auth from "./pages/AuthPage";
import Bookings from "./pages/BookingsPage";
import Events from "./pages/EventsPage";

import MainNavigation from "./components/Navigation";

import "./App.css";
import AuthContext from "./context/auth-context";
import { useState } from "react";

const INITIAL_AUTH_STATE = {
  token: null,
  userId: null,
};
function App() {
  const [authState, setAuthState] = useState(INITIAL_AUTH_STATE);
  const login = (userId, token, _tokenExpiration) => {
    setAuthState((prevState) => ({ ...prevState, token, userId }));
  };

  const logout = () => {
    setAuthState(INITIAL_AUTH_STATE);
  };
  return (
    <BrowserRouter>
      <>
        <AuthContext.Provider
          value={{
            // token: authState.token,
            // userId: authState.userId,
            ...authState,
            login,
            logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Routes>
              {!authState.token && (
                <>
                  <Route
                    path="/"
                    element={<Navigate replace to={"/auth"} />}
                    exact
                  />
                  <Route
                    path="/bookings"
                    element={<Navigate replace to={"/auth"} />}
                    exact
                  />
                  <Route path="/auth" element={<Auth />} />
                </>
              )}
              <Route path="/events" element={<Events />} />
              {authState.token && (
                <>
                  <Route
                    path="/"
                    element={<Navigate replace to={"/events"} />}
                    exact
                  />
                  <Route
                    path="/auth"
                    element={<Navigate replace to={"/events"} />}
                    exact
                  />
                  <Route path="/bookings" element={<Bookings />} />
                </>
              )}
            </Routes>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
}

export default App;
