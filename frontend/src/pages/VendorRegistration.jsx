import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../components/common/Navbar';
import MultiStepRegistration from '../components/vendor/MultiStepRegistration';
import api from '../services/api';
import { ArrowLeft, Sparkles } from 'lucide-react';

const VendorRegistration = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    
    try {
      // First, check if vendor already exists
      const checkResponse = await api.post('/auth/login', { 
        email: data.email, 
        isAdmin: false 
      }).catch(() => null);
      
      if (checkResponse && checkResponse.data.success) {
        toast.error('A vendor with this email already exists. Please login instead.');
        setLoading(false);
        return;
      }
      
      // Register the vendor (without authentication)
      const response = await api.post('/vendors/register', data, {
        headers: {} // Remove auth header for registration
      });
      
      if (response.data.success) {
        toast.success('🎉 Registration successful! Redirecting to dashboard...');
        
        // Auto-login after successful registration
        const loginResult = await login(data.email, null, false);
        
        if (loginResult.success) {
          setTimeout(() => {
            navigate('/vendor/dashboard');
          }, 1500);
        } else {
          // If auto-login fails, redirect to login page
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="btn-secondary flex items-center gap-2 mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </motion.button>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text flex items-center gap-3">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10" />
              Vendor Registration
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Join our platform in just a few simple steps
          </p>
        </motion.div>

        {/* Multi-Step Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MultiStepRegistration onSubmit={handleSubmit} loading={loading} />
        </motion.div>
      </div>
    </div>
  );
};

export default VendorRegistration;

