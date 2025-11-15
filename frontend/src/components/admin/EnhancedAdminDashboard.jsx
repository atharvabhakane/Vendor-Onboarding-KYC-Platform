import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, XCircle, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, previousValue, trend }) => {
  const change = previousValue !== undefined ? value - previousValue : 0;
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="stat-card"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <div className="flex items-center space-x-2">
              <motion.p 
                key={value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold text-gray-900 dark:text-white"
              >
                {value}
              </motion.p>
              {change !== 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                    change > 0 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
                >
                  {change > 0 ? '↑' : '↓'} {Math.abs(changePercent)}%
                </motion.span>
              )}
            </div>
          </div>
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        
        {trend && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Activity className="w-4 h-4 mr-1" />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const EnhancedAdminDashboard = ({ stats, vendors = [] }) => {
  // Generate mock trend data
  const trendData = [
    { month: 'Jan', applications: 45, approved: 35, rejected: 5 },
    { month: 'Feb', applications: 52, approved: 40, rejected: 7 },
    { month: 'Mar', applications: 48, approved: 38, rejected: 6 },
    { month: 'Apr', applications: 61, approved: 50, rejected: 8 },
    { month: 'May', applications: 55, approved: 45, rejected: 6 },
    { month: 'Jun', applications: 67, approved: 55, rejected: 9 }
  ];

  // Status distribution for pie chart
  const statusData = [
    { name: 'Pending', value: stats?.pendingCount || 0, color: '#F59E0B' },
    { name: 'Approved', value: stats?.approvedCount || 0, color: '#10B981' },
    { name: 'Rejected', value: stats?.rejectedCount || 0, color: '#EF4444' }
  ];

  // Business type distribution
  const businessTypeData = vendors.reduce((acc, vendor) => {
    const type = vendor.businessType || 'Other';
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

  return (
    <div className="space-y-8">
      {/* Real-time indicator */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-2">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Live updates • Auto-refresh every 5 seconds
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          previousValue={stats?.previousTotal}
          icon={Users}
          color="from-blue-500 to-blue-600"
          trend="All time applications"
        />
        <StatCard
          title="Pending Review"
          value={stats?.pendingCount || 0}
          previousValue={stats?.previousPending}
          icon={Clock}
          color="from-yellow-500 to-orange-500"
          trend="Awaiting action"
        />
        <StatCard
          title="Approved"
          value={stats?.approvedCount || 0}
          previousValue={stats?.previousApproved}
          icon={CheckCircle}
          color="from-green-500 to-emerald-600"
          trend="Successfully verified"
        />
        <StatCard
          title="Rejected"
          value={stats?.rejectedCount || 0}
          previousValue={stats?.previousRejected}
          icon={XCircle}
          color="from-red-500 to-rose-600"
          trend="Needs correction"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Applications Trend
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="approved" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="rejected" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Business Types */}
        {businessTypeData.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card lg:col-span-2"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Business Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={businessTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {businessTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Quick Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Approval Rate
          </h4>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.totalApplications > 0 
              ? ((stats.approvedCount / stats.totalApplications) * 100).toFixed(1)
              : 0}%
          </p>
        </div>
        
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Avg. Processing Time
          </h4>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            2.5 hrs
          </p>
        </div>
        
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Active This Month
          </h4>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats?.pendingCount || 0}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedAdminDashboard;

