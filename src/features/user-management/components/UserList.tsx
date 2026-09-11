import UserListItem from './UserListItem';

const UserList = () => {
    const users = [
        {
            name: '김민수',
            avatar: '김민',
            email: 'kim.minsu@email.com',
            phone: '010-1234-5678',
            location: '강남구',
            status: '활성' as const,
            role: '사용자' as const,
            lastActivity: '2분 전',
            echoes: 23,
            reports: 5,
        },
        {
            name: '이서영',
            avatar: '이서',
            email: 'lee.seoyoung@email.com',
            phone: '010-9876-5432',
            location: '종로구',
            status: '활성' as const,
            role: '사용자' as const,
            lastActivity: '15분 전',
            echoes: 45,
            reports: 12,
        },
        {
            name: '박지훈',
            avatar: '박지',
            email: 'park.jihoon@email.com',
            phone: '010-5555-1234',
            location: '마포구',
            status: '비활성' as const,
            role: '사용자' as const,
            lastActivity: '3일 전',
            echoes: 8,
            reports: 2,
        },
        {
            name: '최유진',
            avatar: '최유',
            email: 'choi.yujin@email.com',
            phone: '010-7777-8888',
            location: '서초구',
            status: '활성' as const,
            role: '운영자' as const,
            lastActivity: '방금 전',
            echoes: 67,
            reports: 28,
        },
        {
            name: '정하연',
            avatar: '정하',
            email: 'jung.hayeon@email.com',
            phone: '010-3333-4444',
            location: '용산구',
            status: '정지' as const,
            role: '사용자' as const,
            lastActivity: '1주 전',
            echoes: 15,
            reports: 1,
        },
    ];

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">사용자 목록 ({users.length}명)</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {users.map((user, index) => (
                    <UserListItem key={index} user={user} />
                ))}
            </div>
        </div>
    );
};

export default UserList;
