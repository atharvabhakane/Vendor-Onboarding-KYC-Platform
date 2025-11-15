import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  FileCheck, 
  ArrowRight,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Secure KYC Process',
      description: 'Bank-grade encryption for all your vendor documents and data',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Automated approval workflow reduces processing time by 70%',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: CheckCircle,
      title: 'Smart Verification',
      description: 'AI-powered document verification with real-time status updates',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights and reporting for better decision making',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Vendors Onboarded' },
    { icon: FileCheck, value: '99.9%', label: 'Accuracy Rate' },
    { icon: Clock, value: '2 Hours', label: 'Avg Processing Time' },
    { icon: Award, value: '4.9/5', label: 'Customer Rating' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative px-4 py-20 md:py-32"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                ✨ Next-Gen Vendor Management
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Smart Vendor KYC</span>
              <br />
              <span className="text-gray-800 dark:text-gray-100">Made Simple</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Streamline your vendor onboarding process with our intelligent KYC platform. 
              Fast, secure, and compliant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/vendor/register')}
                className="btn-primary flex items-center gap-2 text-lg"
              >
                Register as Vendor
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="btn-outline text-lg"
              >
                Admin Login
              </motion.button>
            </div>
          </motion.div>

          {/* Floating Dashboard Preview */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="glass-card max-w-5xl mx-auto floating">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-6">
                <div className="col-span-1 space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-lg"></div>
                  ))}
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need for seamless vendor management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="glass-card group"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="glass-card text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient"></div>
            <div className="relative z-10">
              <BarChart3 className="w-16 h-16 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of vendors already using our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/vendor/register')}
                  className="btn-primary text-lg"
                >
                  Start Registration
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="btn-secondary text-lg"
                >
                  Sign In
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Smart Vendor KYC Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

