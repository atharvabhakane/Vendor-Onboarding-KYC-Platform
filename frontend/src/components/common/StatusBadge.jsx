import { STATUS_COLORS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

