import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

const VendorSearch = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    businessType: 'all',
    dateRange: 'all'
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: 'all',
      businessType: 'all',
      dateRange: 'all'
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by vendor ID, business name, email..."
            className="input-field pl-12 pr-4"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 relative ${
            showFilters ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Options
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Business Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Type
                  </label>
                  <select
                    value={filters.businessType}
                    onChange={(e) => handleFilterChange('businessType', e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Types</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Wholesaler">Wholesaler</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorSearch;

