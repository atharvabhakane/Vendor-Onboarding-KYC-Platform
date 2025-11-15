import { useForm } from 'react-hook-form';
import { BUSINESS_TYPES } from '../../utils/constants';
import { Building2, User, Mail, Phone, MapPin } from 'lucide-react';

const RegistrationForm = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Business Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-blue-600" />
          Business Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('businessName', { required: 'Business name is required' })}
              className="input-field"
              placeholder="Enter business name"
            />
            {errors.businessName && (
              <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('businessType', { required: 'Business type is required' })}
              className="input-field"
            >
              <option value="">Select type</option>
              {BUSINESS_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.businessType && (
              <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              {...register('contactPerson', { required: 'Contact person is required' })}
              className="input-field"
              placeholder="Enter contact person name"
            />
            {errors.contactPerson && (
              <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="input-field"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone is required' })}
              className="input-field"
              placeholder="+91-1234567890"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Address Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register('address.street', { required: 'Street address is required' })}
              className="input-field"
              placeholder="Enter street address"
            />
            {errors.address?.street && (
              <p className="text-red-500 text-sm mt-1">{errors.address.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                {...register('address.city', { required: 'City is required' })}
                className="input-field"
                placeholder="Enter city"
              />
              {errors.address?.city && (
                <p className="text-red-500 text-sm mt-1">{errors.address.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                {...register('address.state', { required: 'State is required' })}
                className="input-field"
                placeholder="Enter state"
              />
              {errors.address?.state && (
                <p className="text-red-500 text-sm mt-1">{errors.address.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                {...register('address.pincode', { required: 'Pincode is required' })}
                className="input-field"
                placeholder="Enter pincode"
              />
              {errors.address?.pincode && (
                <p className="text-red-500 text-sm mt-1">{errors.address.pincode.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                {...register('address.country', { required: 'Country is required' })}
                className="input-field"
                placeholder="Enter country"
                defaultValue="India"
              />
              {errors.address?.country && (
                <p className="text-red-500 text-sm mt-1">{errors.address.country.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Registration'}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;

