import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EnhancedAdminDashboard from '../components/admin/EnhancedAdminDashboard';
import VendorSearch from '../components/admin/VendorSearch';
import VendorList from '../components/admin/VendorList';
import VendorDetails from '../components/admin/VendorDetails';
import ApprovalActions from '../components/admin/ApprovalActions';
import api from '../services/api';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const [statsResponse, vendorsResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/vendors')
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (vendorsResponse.data.success) {
        setVendors(vendorsResponse.data.vendors);
        setFilteredVendors(vendorsResponse.data.vendors);
      }

      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      if (showLoadingSpinner) {
        setError(err.response?.data?.message || 'Failed to load data');
      } else {
        // Silent fail for background updates
        console.error('Background update failed:', err);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial load
    fetchData(true);

    // Set up polling every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchData(false); // Background update without loading spinner
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Update the "last updated" display every second
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(prev => prev); // Trigger re-render to update time display
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdated]);

  const handleViewDetails = async (vendor) => {
    try {
      const response = await api.get(`/admin/vendors/${vendor._id}`);
      if (response.data.success) {
        setSelectedVendor(response.data.vendor);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load vendor details');
    }
  };

  const handleApprove = async (vendorId) => {
    try {
      const response = await api.put(`/admin/vendors/${vendorId}/status`, {
        status: 'Approved'
      });

      if (response.data.success) {
        toast.success('Vendor approved successfully!');
        setSelectedVendor(null);
        setShowApprovalDialog(false);
        fetchData(); // Refresh data
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve vendor');
    }
  };

  const handleReject = async (vendorId, rejectionReason) => {
    try {
      const response = await api.put(`/admin/vendors/${vendorId}/status`, {
        status: 'Rejected',
        rejectionReason
      });

      if (response.data.success) {
        toast.success('Vendor rejected successfully!');
        setSelectedVendor(null);
        setShowApprovalDialog(false);
        fetchData(); // Refresh data
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject vendor');
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredVendors(vendors);
      return;
    }

    const filtered = vendors.filter(vendor =>
      vendor.vendorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone?.includes(searchTerm)
    );
    setFilteredVendors(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...vendors];

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(v => v.status === filters.status);
    }

    // Business type filter
    if (filters.businessType && filters.businessType !== 'all') {
      filtered = filtered.filter(v => v.businessType === filters.businessType);
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(v => {
        const submittedDate = new Date(v.submittedAt);
        switch (filters.dateRange) {
          case 'today':
            return submittedDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return submittedDate >= weekAgo;
          case 'month':
            return submittedDate.getMonth() === now.getMonth() && 
                   submittedDate.getFullYear() === now.getFullYear();
          case 'year':
            return submittedDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredVendors(filtered);
  };

  const handleShowApprovalActions = (vendor) => {
    setSelectedVendor(vendor);
    setShowApprovalDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 flex items-center space-x-3 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Real-time Live Badge */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-20 right-4 z-40"
      >
        <div className="flex items-center space-x-2 px-4 py-2 glass-card shadow-xl">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <motion.div 
              animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full"
            />
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">LIVE</span>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="gradient-text flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  Admin Dashboard
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Review and manage vendor applications with real-time insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
                  <span>
                    {isRefreshing ? 'Updating...' : `${Math.floor((new Date() - lastUpdated) / 1000)}s ago`}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchData(false)}
                disabled={isRefreshing}
                className="btn-outline text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <EnhancedAdminDashboard stats={stats} vendors={vendors} />
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <VendorSearch onSearch={handleSearch} onFilter={handleFilter} />
        </motion.div>

        {/* Vendor List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <VendorList 
            vendors={filteredVendors} 
            onViewDetails={handleViewDetails}
          />
        </motion.div>
      </div>

      {/* Vendor Details Modal */}
      {selectedVendor && !showApprovalDialog && (
        <VendorDetails
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onApprove={() => handleShowApprovalActions(selectedVendor)}
          onReject={() => handleShowApprovalActions(selectedVendor)}
        />
      )}

      {/* Approval Actions Dialog */}
      {showApprovalDialog && selectedVendor && (
        <ApprovalActions
          vendor={selectedVendor}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => {
            setShowApprovalDialog(false);
            setSelectedVendor(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;

