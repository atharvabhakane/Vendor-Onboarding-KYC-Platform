import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { BUSINESS_TYPES } from '../../utils/constants';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Upload
} from 'lucide-react';

const steps = [
  { id: 1, name: 'Business Info', icon: Building2 },
  { id: 2, name: 'Contact Details', icon: User },
  { id: 3, name: 'Address', icon: MapPin },
  { id: 4, name: 'Documents', icon: Upload }
];

const MultiStepRegistration = ({ onSubmit, loading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, formState: { errors }, trigger } = useForm();

  const validateStep = async () => {
    let fieldsToValidate = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['businessName', 'businessType'];
        break;
      case 2:
        fieldsToValidate = ['contactPerson', 'email', 'phone'];
        break;
      case 3:
        fieldsToValidate = ['address.street', 'address.city', 'address.state', 'address.pincode', 'address.country'];
        break;
      default:
        return true;
    }
    
    return await trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onFormSubmit = (data) => {
    setFormData({ ...formData, ...data });
    if (currentStep === steps.length) {
      onSubmit({ ...formData, ...data });
    } else {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="relative">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: currentStep > step.id ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                  />
                </div>
              )}
              
              {/* Step Circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`
                  relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 mb-2
                  ${currentStep >= step.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </motion.div>
              
              {/* Step Label */}
              <span className={`
                text-xs sm:text-sm font-medium text-center
                ${currentStep >= step.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
                }
              `}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="card">
                <h3 className="text-2xl font-bold mb-6 flex items-center gradient-text">
                  <Building2 className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Business Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('businessName', { required: 'Business name is required' })}
                      className="input-field"
                      placeholder="Enter your business name"
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('businessType', { required: 'Business type is required' })}
                      className="input-field"
                    >
                      <option value="">Select business type</option>
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
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="card">
                <h3 className="text-2xl font-bold mb-6 flex items-center gradient-text">
                  <User className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="input-field pl-12"
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone is required' })}
                        className="input-field pl-12"
                        placeholder="+91-1234567890"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div className="card">
                <h3 className="text-2xl font-bold mb-6 flex items-center gradient-text">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            )}

            {/* Step 4: Document Info */}
            {currentStep === 4 && (
              <div className="card">
                <h3 className="text-2xl font-bold mb-6 flex items-center gradient-text">
                  <Upload className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Almost Done!
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <CheckCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                      Your basic information has been recorded. After registration, you'll be able to upload documents from your dashboard.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Business information verified
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Contact details recorded
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Address information saved
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          {currentStep > 1 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={prevStep}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </motion.button>
          ) : (
            <div></div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {currentStep === steps.length ? (
              <>
                {loading ? 'Submitting...' : 'Complete Registration'}
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default MultiStepRegistration;

