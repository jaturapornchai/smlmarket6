import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-medium text-gray-600 mb-6">ไม่พบสินค้าที่คุณต้องการ</h2>
                <p className="text-gray-500 mb-8">
                    สินค้าที่คุณกำลังหาอาจถูกลบหรือเปลี่ยนแปลงแล้ว
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    กลับไปหน้าหลัก
                </Link>
            </div>
        </div>
    );
}
