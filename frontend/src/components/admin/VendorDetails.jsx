import StatusBadge from '../common/StatusBadge';
import { X, Building2, Mail, Phone, MapPin, FileText, Download, Calendar, AlertCircle } from 'lucide-react';

const VendorDetails = ({ vendor, onClose, onApprove, onReject }) => {
  if (!vendor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{vendor.businessName}</h2>
            <p className="text-gray-600">Vendor ID: {vendor.vendorId}</p>
          </div>
          <div className="flex items-center space-x-4">
            <StatusBadge status={vendor.status} />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resubmission Notice */}
          {vendor.status === 'Pending' && 
           vendor.statusHistory && 
           vendor.statusHistory.length > 1 && 
           vendor.statusHistory[vendor.statusHistory.length - 2]?.status === 'Rejected' && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-orange-700">
                    <strong className="font-medium">⚠️ Resubmission:</strong> This vendor was previously rejected and has uploaded new documents for re-review.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Business Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Business Information
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Business Type</p>
                <p className="font-medium">{vendor.businessType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact Person</p>
                <p className="font-medium">{vendor.contactPerson}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
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

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              KYC Documents ({vendor.documents?.length || 0})
            </h3>
            {vendor.documents && vendor.documents.length > 0 ? (
              <div className="space-y-2">
                {vendor.documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{doc.documentType}</p>
                      <p className="text-sm text-gray-600">{doc.fileName}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()} at {new Date(doc.uploadedAt).toLocaleTimeString()}
                      </p>
                      {doc.uploadedBy && (
                        <p className="text-xs text-blue-600 mt-1 flex items-center">
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          Uploaded by: {doc.uploadedBy.name} ({doc.uploadedBy.email})
                        </p>
                      )}
                    </div>
                    <a
                      href={`http://localhost:5001${doc.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 ml-4"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">No documents uploaded</p>
            )}
          </div>

          {/* Status History */}
          {vendor.statusHistory && vendor.statusHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Status History
              </h3>
              <div className="space-y-3">
                {vendor.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
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
                          By: {history.changedBy.name} ({history.changedBy.email})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejection Reason */}
          {vendor.status === 'Rejected' && vendor.rejectionReason && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="font-medium text-red-800 mb-1">Rejection Reason:</p>
              <p className="text-red-700">{vendor.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {vendor.status !== 'Approved' && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end space-x-4">
            {vendor.status === 'Rejected' && (
              <div className="flex-1 text-sm text-gray-600 flex items-center">
                <span>💡 Tip: Vendor can upload new documents to resubmit automatically, or you can manually approve.</span>
              </div>
            )}
            <button
              onClick={onReject}
              className="btn-danger"
            >
              {vendor.status === 'Rejected' ? 'Update Rejection Reason' : 'Reject Application'}
            </button>
            <button
              onClick={onApprove}
              className="btn-success"
            >
              {vendor.status === 'Rejected' ? 'Approve Anyway' : 'Approve Application'}
            </button>
          </div>
        )}
        
        {/* Actions for Approved Vendors */}
        {vendor.status === 'Approved' && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end space-x-4">
            <div className="flex-1 text-sm text-green-700 flex items-center">
              <span>✅ This vendor has been approved. Contact support if you need to change the status.</span>
            </div>
            <button
              onClick={onReject}
              className="btn-danger"
            >
              Revoke Approval
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDetails;

