import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const ApprovalActions = ({ vendor, onApprove, onReject, onClose }) => {
  const [action, setAction] = useState(null); // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    setError('');
    
    try {
      await onApprove(vendor._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to approve vendor');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onReject(vendor._id, rejectionReason);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reject vendor');
    } finally {
      setLoading(false);
    }
  };

  if (!action) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-xl font-bold mb-4">Review Application</h3>
          <p className="text-gray-600 mb-6">
            What action would you like to take for {vendor.businessName}?
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setAction('approve')}
              className="w-full btn-success flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Approve Application</span>
            </button>
            
            <button
              onClick={() => setAction('reject')}
              className="w-full btn-danger flex items-center justify-center space-x-2"
            >
              <XCircle className="w-5 h-5" />
              <span>Reject Application</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (action === 'approve') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">Approve Application</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to approve the application for <strong>{vendor.businessName}</strong>?
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={() => setAction(null)}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 btn-success"
              disabled={loading}
            >
              {loading ? 'Approving...' : 'Confirm Approval'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (action === 'reject') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold">Reject Application</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Please provide a reason for rejecting <strong>{vendor.businessName}</strong>:
          </p>
          
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="input-field min-h-[120px] mb-4"
            disabled={loading}
          />
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={() => setAction(null)}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={handleReject}
              className="flex-1 btn-danger"
              disabled={loading}
            >
              {loading ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ApprovalActions;

