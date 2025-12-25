import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import routes from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layouts/MainLayout';
import AudioPlayer from '@/components/AudioPlayer';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {isAuthPage ? (
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <MainLayout>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AudioPlayer />
        </MainLayout>
      )}
      <Toaster />
    </>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AudioPlayerProvider>
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        </AudioPlayerProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
