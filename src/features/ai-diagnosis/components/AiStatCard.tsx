import React from 'react';

interface AiStatCardProps {
  title: string;
  value: string;
  change: string | null;
  icon: React.ReactNode;
  iconBgColor?: string;
}

const AiStatCard: React.FC<AiStatCardProps> = ({ title, value, change, icon, iconBgColor = 'bg-gray-200' }) => {
  return (
    <div className="bg-white p-5 shadow rounded-lg flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-green-600 font-medium">{change}</p>
      </div>
      <div className={`p-3 rounded-md ${iconBgColor}`}>
        {icon}
      </div>
    </div>
  );
};

export default AiStatCard;
