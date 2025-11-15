import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Moon, Sun, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate(user ? (user.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard') : '/')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-50"></div>
              {user?.role === 'admin' ? (
                <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400 relative" />
              ) : (
                <User className="w-7 h-7 text-blue-600 dark:text-blue-400 relative" />
              )}
            </div>
            <div>
              <span className="text-xl font-bold gradient-text">
                Smart Vendor KYC
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Next-Gen Platform
              </p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </motion.button>

            {user ? (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center justify-end gap-1">
                    {user.role === 'admin' ? (
                      <Shield className="w-3 h-3" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    {user.role}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="btn-secondary flex items-center space-x-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="btn-primary flex items-center space-x-2 text-sm"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

