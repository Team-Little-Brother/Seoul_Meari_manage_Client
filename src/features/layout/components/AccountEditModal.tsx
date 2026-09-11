import React from 'react';
import ReactDOM from 'react-dom';

interface AccountEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'edit' | 'add';
}

const AccountEditModal: React.FC<AccountEditModalProps> = ({ isOpen, onClose, mode = 'edit' }) => {
    if (!isOpen) return null;

    const isAddMode = mode === 'add';
    const title = isAddMode ? '새 관리자 추가' : '계정 정보 수정';
    const buttonText = isAddMode ? '관리자 추가' : '변경사항 저장';

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-5 border-b">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">아이디 (이메일)</label>
                        <input 
                            type="email" 
                            defaultValue={isAddMode ? "" : "mj.kim@seoul-echo.dev"} 
                            placeholder={isAddMode ? "admin@seoul-echo.dev" : ""}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    {!isAddMode && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
                            <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {isAddMode ? '비밀번호' : '새 비밀번호'}
                        </label>
                        <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {isAddMode ? '비밀번호 확인' : '새 비밀번호 확인'}
                        </label>
                        <input type="password" placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-100">
                        취소
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700">
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );

    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? ReactDOM.createPortal(modalContent, modalRoot) : null;
};

export default AccountEditModal;
