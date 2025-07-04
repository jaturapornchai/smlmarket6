'use client';

import { Header } from '@/components';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const testUsers = [
    { email: 'test01@gmail.com', name: 'ทดสอบ 01' },
    { email: 'test02@gmail.com', name: 'ทดสอบ 02' },
    { email: 'test03@gmail.com', name: 'ทดสอบ 03' },
    { email: 'test04@gmail.com', name: 'ทดสอบ 04' },
    { email: 'test05@gmail.com', name: 'ทดสอบ 05' },
    { email: 'test06@gmail.com', name: 'ทดสอบ 06' },
    { email: 'test07@gmail.com', name: 'ทดสอบ 07' },
    { email: 'test08@gmail.com', name: 'ทดสอบ 08' },
    { email: 'test09@gmail.com', name: 'ทดสอบ 09' },
];

export default function LoginPage() {
    const { login, isLoggedIn } = useAuth();
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    const handleLogin = async () => {
        if (!selectedUser) return;

        const user = testUsers.find(u => u.email === selectedUser);
        if (!user) return;

        setIsLoading(true);

        // Simulate loading
        setTimeout(() => {
            login(user.email, user.name);
            setIsLoading(false);
            router.push('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-md mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            เข้าสู่ระบบ
                        </h1>
                        <p className="text-gray-600">
                            เลือกอีเมลสำหรับทดสอบระบบ
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                เลือกผู้ใช้ทดสอบ
                            </label>
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">กรุณาเลือกผู้ใช้</option>
                                {testUsers.map((user) => (
                                    <option key={user.email} value={user.email}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={!selectedUser || isLoading}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังเข้าสู่ระบบ...
                                </div>
                            ) : (
                                'เข้าสู่ระบบ'
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
