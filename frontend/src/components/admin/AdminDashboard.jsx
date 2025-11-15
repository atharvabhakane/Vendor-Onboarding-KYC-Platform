import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, previousValue }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [change, setChange] = useState(0);

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      setIsUpdating(true);
      setChange(value - previousValue);
      
      const timer = setTimeout(() => {
        setIsUpdating(false);
        setChange(0);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  return (
    <div className={`card transition-all duration-300 ${isUpdating ? 'ring-2 ring-blue-400 shadow-lg' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-center space-x-2">
            <p className={`text-3xl font-bold transition-all duration-500 ${isUpdating ? 'scale-110' : ''}`}>
              {value}
            </p>
            {change !== 0 && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              } animate-bounce`}>
                {change > 0 ? '+' : ''}{change}
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-full ${color} transition-transform duration-300 ${isUpdating ? 'scale-110' : ''}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ stats }) => {
  const [previousStats, setPreviousStats] = useState(stats);

  useEffect(() => {
    if (stats && JSON.stringify(stats) !== JSON.stringify(previousStats)) {
      const timer = setTimeout(() => {
        setPreviousStats(stats);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [stats, previousStats]);

  return (
    <div className="space-y-4">
      {/* Real-time update info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span>Stats update automatically every 5 seconds</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          previousValue={previousStats?.totalApplications}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          title="Pending Review"
          value={stats?.pendingCount || 0}
          previousValue={previousStats?.pendingCount}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Approved"
          value={stats?.approvedCount || 0}
          previousValue={previousStats?.approvedCount}
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatCard
          title="Rejected"
          value={stats?.rejectedCount || 0}
          previousValue={previousStats?.rejectedCount}
          icon={XCircle}
          color="bg-red-600"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

