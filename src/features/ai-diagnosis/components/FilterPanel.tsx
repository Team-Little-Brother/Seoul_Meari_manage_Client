import React from 'react';
import CustomDropdown from '@/components/common/CustomDropdown';

type ViewType = 'list' | 'map';
export type StatusType = '전체 상태' | '해결' | '미해결';
export type SortByType = '최신순' | '오래된순';

interface FilterPanelProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  status: StatusType;
  onStatusChange: (status: StatusType) => void;
  sortBy: SortByType;
  onSortByChange: (sortBy: SortByType) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  activeView, onViewChange,
  status, onStatusChange,
  sortBy, onSortByChange
}) => {
  const statusOptions: StatusType[] = ['전체 상태', '해결', '미해결'];
  const sortOptions: SortByType[] = ['최신순', '오래된순'];

  const getButtonClass = (view: ViewType) => {
    return `px-3 py-1 text-sm font-medium rounded-md transition-colors ${
      activeView === view
        ? 'bg-white text-gray-800 shadow'
        : 'text-gray-500 hover:bg-white/60'
    }`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-48">
            <CustomDropdown 
              options={statusOptions} 
              value={status} 
              onChange={(option) => onStatusChange(option as StatusType)} 
            />
          </div>
          <div className="w-48">
            <CustomDropdown 
              options={sortOptions} 
              value={sortBy} 
              onChange={(option) => onSortByChange(option as SortByType)} 
            />
          </div>
        </div>
        <div className="flex items-center bg-gray-100 p-1 rounded-md">
          <button className={getButtonClass('list')} onClick={() => onViewChange('list')}>
            목록 보기
          </button>
          <button className={getButtonClass('map')} onClick={() => onViewChange('map')}>
            지도 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
