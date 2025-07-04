'use client';

import { useAuth } from '@/lib/authContext';
import { useUserOrders } from '@/lib/firebaseHooks';
import { OrderItem } from '@/lib/firebaseTypes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrdersClient() {
    const [showSuccess, setShowSuccess] = useState(false);
    const [successOrderNumber, setSuccessOrderNumber] = useState('');

    const { user, isLoggedIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Use the new hook for user orders
    const { orders, loading, error } = useUserOrders(user?.email || '');

    useEffect(() => {
        // Check for success message from order creation
        const success = searchParams.get('success');
        const orderNumber = searchParams.get('orderNumber');

        if (success === 'true' && orderNumber) {
            setShowSuccess(true);
            setSuccessOrderNumber(orderNumber);

            // Clear the URL params after showing success
            const url = new URL(window.location.href);
            url.searchParams.delete('success');
            url.searchParams.delete('orderNumber');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams]);

    // Redirect to login if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return null; // Will redirect to login
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">เกิดข้อผิดพลาด</h1>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="space-x-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                ลองใหม่
                            </button>
                            <Link href="/" className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                                กลับไปหน้าแรก
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Success Message */}
            {showSuccess && (
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">สร้างคำสั่งซื้อเรียบร้อย!</h3>
                                <p className="text-sm text-green-700">หมายเลขคำสั่งซื้อ: {successOrderNumber}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setShowSuccess(false)}
                                    className="text-green-700 hover:text-green-900 focus:outline-none"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">
                            ใบสั่งซื้อของฉัน
                        </h1>
                        <p className="text-gray-600 mt-1">
                            ติดตามสถานะและรายละเอียดใบสั่งซื้อของคุณ
                        </p>
                    </div>

                    <div className="p-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📋</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    ยังไม่มีใบสั่งซื้อ
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    เมื่อคุณทำการสั่งซื้อสินค้า ใบสั่งซื้อจะแสดงที่นี่
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    เริ่มช็อปปิ้ง
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.orderNumber} className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Order Header */}
                                        <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                                    Order #{order.orderNumber}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.orderDate).toLocaleDateString('th-TH', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                                                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status === 'pending' && 'รอดำเนินการ'}
                                                    {order.status === 'confirmed' && 'ยืนยันแล้ว'}
                                                    {order.status === 'processing' && 'กำลังจัดเตรียม'}
                                                    {order.status === 'shipped' && 'จัดส่งแล้ว'}
                                                    {order.status === 'delivered' && 'ส่งสำเร็จ'}
                                                    {order.status === 'cancelled' && 'ยกเลิก'}
                                                    {!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(order.status) && order.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Order Details */}
                                        <div className="bg-white">
                                            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">จำนวนสินค้า:</span>
                                                        <span className="ml-2 font-medium">{order.totalItems} รายการ</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">ราคารวม:</span>
                                                        <span className="ml-2 font-medium">฿{order.acceptedTotal.toLocaleString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">ส่วนตกลง:</span>
                                                        <span className="ml-2 font-medium">฿{order.negotiatedTotal.toLocaleString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">ยอดสุทธิ:</span>
                                                        <span className="ml-2 font-medium text-green-600">฿{(order.acceptedTotal + order.negotiatedTotal).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Customer Note */}
                                            {order.customerNote && (
                                                <div className="px-4 sm:px-6 py-3 bg-yellow-50 border-b border-gray-200">
                                                    <p className="text-sm">
                                                        <span className="font-medium text-gray-900">หมายเหตุ:</span>
                                                        <span className="ml-2 text-gray-700">{order.customerNote}</span>
                                                    </p>
                                                </div>
                                            )}

                                            {/* Order Items */}
                                            <div className="p-4 sm:p-6">
                                                <div className="p-4 sm:p-6">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                                                        รายการสินค้า ({order.totalItems} รายการ)
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {order.items.map((item: OrderItem, index: number) => (
                                                            <div key={index} className="flex items-center space-x-3">
                                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                                    {item.image ? (
                                                                        <Image
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            width={48}
                                                                            height={48}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                            <span className="text-gray-400 text-xs">No Image</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="text-sm font-medium text-gray-900 truncate">
                                                                        {item.name}
                                                                    </h5>
                                                                    <p className="text-xs text-gray-500">
                                                                        รหัส: {item.code}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        ฿{item.price.toLocaleString()} × {item.quantity} {item.unit}
                                                                    </p>
                                                                    <p className="text-sm font-medium text-green-600">
                                                                        ฿{item.subtotal.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
