import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Download, AlertCircle } from 'lucide-react';
import { DOCUMENT_TYPES } from '../../utils/constants';

const DocumentUpload = ({ vendorId, documents, onUpload, onDelete }) => {
  const [selectedType, setSelectedType] = useState('GST');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setError('');
    setUploading(true);
    
    try {
      await onUpload(file, selectedType);
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false,
    disabled: uploading
  });

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Upload KYC Documents</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input-field max-w-xs"
          >
            {DOCUMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          {uploading ? (
            <p className="text-gray-600">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-blue-600">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag and drop a file here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Uploaded Documents */}
      {documents && documents.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <File className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.documentType}</p>
                    <p className="text-sm text-gray-500">{doc.fileName}</p>
                    <p className="text-xs text-gray-400">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <a
                    href={`http://localhost:5001${doc.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => onDelete(doc._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;

