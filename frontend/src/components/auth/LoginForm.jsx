import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Shield, AlertCircle, Mail, Lock, Sparkles } from 'lucide-react';

const LoginForm = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate input
    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    if (isAdmin && !password) {
      setError('Password is required for admin login');
      setLoading(false);
      return;
    }

    const result = await login(email, password, isAdmin);

    if (result.success) {
      // Redirect based on role
      if (result.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/vendor/dashboard');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative glass-card w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-2 gradient-text">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Smart Vendor KYC Platform</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-2 text-red-700 dark:text-red-400"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setIsAdmin(false);
                  setPassword('');
                  setError('');
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  !isAdmin
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <User className={`w-8 h-8 mx-auto mb-2 ${
                  !isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                }`} />
                <p className={`text-sm font-medium ${
                  !isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Vendor
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setIsAdmin(true);
                  setError('');
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isAdmin
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Shield className={`w-8 h-8 mx-auto mb-2 ${
                  isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                }`} />
                <p className={`text-sm font-medium ${
                  isAdmin ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Admin
                </p>
              </motion.button>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder={isAdmin ? "admin@example.com" : "your-email@example.com"}
                required
              />
            </div>
          </div>

          {/* Password Field - Only for Admin */}
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {isAdmin ? (
                <span><strong>Admin:</strong> Login with your credentials</span>
              ) : (
                <span><strong>Vendor:</strong> Enter your registered email to login</span>
              )}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>

          {!isAdmin && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="button"
                onClick={() => navigate('/vendor/register')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold"
              >
                Register as Vendor
              </motion.button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

