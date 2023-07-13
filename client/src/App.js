import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Auth from './pages/AuthPage';
import Bookings from './pages/BookingsPage';
import Events from './pages/EventsPage';

import MainNavigation from './components/Navigation';
import { useAuth } from './context/auth-context';

import './App.css';

function App() {
  const authState = useAuth();
  return (
    <BrowserRouter>
      <>
        <MainNavigation />
        <main className="main-content">
          <Routes>
            {!authState.token && (
              <>
                <Route
                  path="/"
                  element={<Navigate replace to={'/auth'} />}
                  exact
                />
                <Route
                  path="/bookings"
                  element={<Navigate replace to={'/auth'} />}
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
                  element={<Navigate replace to={'/events'} />}
                  exact
                />
                <Route
                  path="/auth"
                  element={<Navigate replace to={'/events'} />}
                  exact
                />
                <Route path="/bookings" element={<Bookings />} />
              </>
            )}
          </Routes>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
