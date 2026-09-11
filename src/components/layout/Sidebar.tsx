import { NavLink } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useUiStore();

  const menuItems = [
    {
      title: '모니터링',
      links: [
        { name: '대시보드', path: '/dashboard', icon: <HomeIcon /> },
        { name: 'AI 도시 진단', path: '/ai-diagnosis', icon: <ChartBarIcon /> },
        { name: 'AR 메아리 관리', path: '/ar-echo', icon: <CubeIcon /> },
      ],
    },
    {
      title: '관리',
      links: [
        { name: 'VR 콘텐츠 관리', path: '/vr-contents', icon: <VrIcon /> },
        { name: '사용자 관리', path: '/users', icon: <UsersIcon /> },
        { name: '관리자 계정 설정', path: '/admin', icon: <WrenchScrewdriverIcon /> },
      ],
    },
  ];

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    } ${isSidebarOpen ? 'px-4' : 'justify-center'}`;

  return (
    <aside className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200 flex-shrink-0">
        <div className={`overflow-hidden transition-all duration-200 ${isSidebarOpen ? 'w-32' : 'w-0'}`}>
          <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">서울 메아리</h1>
        </div>
        <div className="flex-grow" />
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
          <MenuAlt1Icon />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        {menuItems.map((section, sectionIndex) => (
          <div key={section.title}>
             <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'h-5' : 'h-0'}`}>
                <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {section.title}
                </h2>
            </div>
            {!isSidebarOpen && sectionIndex > 0 && <div className="border-t mx-auto w-8 my-2"></div>}
            
            <div className="space-y-1">
              {section.links.map((link) => (
                <NavLink key={link.name} to={link.path} className={navLinkClasses} end title={!isSidebarOpen ? link.name : undefined}>
                  <span className="w-5 h-5 flex-shrink-0">{link.icon}</span>
                  <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-200 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                    {link.name}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

// Placeholder Icons (SVG)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const CubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const WrenchScrewdriverIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const MenuAlt1Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
    </svg>
);

const VrIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16a2 2 0 012 2v2a5 5 0 01-5 5h-2l-2-3-2 3H7a5 5 0 01-5-5v-2a2 2 0 012-2z" />
    <circle cx="9" cy="13" r="1.5" fill="currentColor" />
    <circle cx="15" cy="13" r="1.5" fill="currentColor" />
  </svg>
);


export default Sidebar;
