import StatusBadge from '../common/StatusBadge';
import { Building2, Mail, Phone, MapPin, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const VendorDashboard = ({ vendor }) => {
  if (!vendor) return null;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Application Status</h3>
          <StatusBadge status={vendor.status} />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Vendor ID:</span>
            <span className="font-mono font-medium">{vendor.vendorId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Submitted:</span>
            <span className="text-sm">{new Date(vendor.submittedAt).toLocaleDateString()}</span>
          </div>
          {vendor.reviewedAt && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">Reviewed:</span>
              <span className="text-sm">{new Date(vendor.reviewedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {vendor.status === 'Rejected' && vendor.rejectionReason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Rejection Reason:</p>
                <p className="text-sm text-red-700 mt-1">{vendor.rejectionReason}</p>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>📤 What to do next:</strong> Upload new/corrected documents in the right panel. 
                    Your application will automatically be resubmitted for review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {vendor.status === 'Approved' && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">
                  Congratulations! Your application has been approved.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Business Details */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-blue-600" />
          Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Business Name</p>
            <p className="font-medium">{vendor.businessName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Business Type</p>
            <p className="font-medium">{vendor.businessType}</p>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{vendor.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{vendor.phone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">
                {vendor.address.street}, {vendor.address.city}, {vendor.address.state} - {vendor.address.pincode}, {vendor.address.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status History */}
      {vendor.statusHistory && vendor.statusHistory.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Status History
          </h3>
          <div className="space-y-4">
            {vendor.statusHistory.map((history, index) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={history.status} />
                    <span className="text-sm text-gray-500">
                      {new Date(history.changedAt).toLocaleString()}
                    </span>
                  </div>
                  {history.comment && (
                    <p className="text-sm text-gray-600 mt-2">{history.comment}</p>
                  )}
                  {history.changedBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      By: {history.changedBy.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;

