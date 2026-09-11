import UserStatCard from '@/features/user-management/components/UserStatCard';
import UserFilterPanel from '@/features/user-management/components/UserFilterPanel';
import UserList from '@/features/user-management/components/UserList';

const UserManagementPage = () => {

    const userStats = [
        { title: '총 사용자', value: '5', change: '+12', icon: <UsersGroupIcon /> },
        { title: '활성 사용자', value: '3', change: '+8', icon: <UserIcon /> },
        { title: '신규 가입', value: '23', change: '+5', icon: <UserPlusIcon /> },
        { title: '정지된 사용자', value: '1', change: '-2', icon: <UserMinusIcon /> },
    ];

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
                <p className="text-md text-gray-500 mt-1">서울 메아리 사용자 계정 관리</p>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {userStats.map((item) => (
                    <UserStatCard key={item.title} {...item} />
                ))}
            </div>

            {/* 필터 및 검색 */}
            <UserFilterPanel />

            {/* 사용자 목록 */}
            <UserList />
        </div>
    );
};

// Icons
const UserIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const UserPlusIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
const UserMinusIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const UsersGroupIcon = ({ className = "h-6 w-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

export default UserManagementPage;
