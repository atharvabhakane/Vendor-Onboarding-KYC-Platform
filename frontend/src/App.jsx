import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import VendorRegistration from './pages/VendorRegistration';
import VendorDashboardPage from './pages/VendorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import ToastProvider from './components/common/ToastProvider';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'} replace />;
  }

  return children;
};

// Public Route (only accessible when logged out)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider />
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />

            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />

            {/* Vendor Routes */}
            <Route path="/vendor/register" element={<VendorRegistration />} />
            
            <Route path="/vendor/dashboard" element={
              <ProtectedRoute allowedRole="vendor">
                <VendorDashboardPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

