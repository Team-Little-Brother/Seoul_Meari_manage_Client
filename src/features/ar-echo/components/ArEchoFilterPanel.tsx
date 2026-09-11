import React from 'react';

type ViewType = 'list' | 'map';

interface ArEchoFilterPanelProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ArEchoFilterPanel: React.FC<ArEchoFilterPanelProps> = ({ 
  activeView, 
  onViewChange, 
  searchTerm, 
  onSearchChange
}) => {

  const getButtonClass = (view: ViewType) => {
    return `px-3 py-1 text-sm font-medium rounded-md transition-colors ${
      activeView === view
        ? 'bg-white text-gray-800 shadow'
        : 'text-gray-500 hover:bg-white/60'
    }`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center gap-4">
            {/* 검색창 */}
            <div className="flex-1 relative max-w-md">
                <SearchIcon />
                <input 
                    type="text" 
                    placeholder="내용 또는 작성자로 검색" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            {/* 탭 */}
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

const SearchIcon = () => (
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    </div>
);

export default ArEchoFilterPanel;
