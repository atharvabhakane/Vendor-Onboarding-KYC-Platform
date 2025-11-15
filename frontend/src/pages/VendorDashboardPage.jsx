import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import VendorDashboard from '../components/vendor/VendorDashboard';
import DocumentUpload from '../components/vendor/DocumentUpload';
import api from '../services/api';
import { AlertCircle, CheckCircle, Plus } from 'lucide-react';

const VendorDashboardPage = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const fetchVendorProfile = async () => {
    try {
      const response = await api.get('/vendors/profile');
      
      if (response.data.success) {
        setVendor(response.data.vendor);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Vendor profile doesn't exist, redirect to registration
        navigate('/vendor/register');
      } else {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorProfile();
  }, []);

  const handleUploadDocument = async (file, documentType) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    try {
      const response = await api.post(`/vendors/${vendor._id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Check if status changed from Rejected to Pending
        if (response.data.statusChanged && response.data.newStatus === 'Pending') {
          showNotification(
            'Document uploaded! Your application has been resubmitted for review.', 
            'success'
          );
        } else {
          showNotification('Document uploaded successfully!', 'success');
        }
        fetchVendorProfile(); // Refresh vendor data
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to upload document');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await api.delete(`/vendors/${vendor._id}/documents/${documentId}`);
      
      if (response.data.success) {
        showNotification('Document deleted successfully!', 'success');
        fetchVendorProfile(); // Refresh vendor data
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to delete document', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Manage your vendor profile and documents</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Vendor Details */}
          <div className="lg:col-span-2">
            <VendorDashboard vendor={vendor} />
          </div>

          {/* Right Column - Document Upload */}
          <div className="lg:col-span-1">
            <DocumentUpload
              vendorId={vendor._id}
              documents={vendor.documents}
              onUpload={handleUploadDocument}
              onDelete={handleDeleteDocument}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;

