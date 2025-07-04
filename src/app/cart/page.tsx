'use client';

import { Header } from '@/components';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/firebaseHooks';
import { OrderItem } from '@/lib/firebaseTypes';
import { OrderService } from '@/lib/orderService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [customerNote, setCustomerNote] = useState('');
    const { user, isLoggedIn } = useAuth();
    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    // Use Firebase cart hook with logged-in user's email
    const {
        cartItems,
        cartTotal,
        cartItemCount,
        updateQuantity,
        removeItem,
        clearCart,
        loading,
        error
    } = useCart(user?.email || '');

    const handleCreateOrder = async () => {
        if (cartItems.length === 0 || !user?.email) return;

        setIsCreatingOrder(true);

        try {
            // Convert cart items to order items
            const orderItems: OrderItem[] = cartItems.map(item => ({
                productId: item.productId,
                name: item.name,
                code: item.code,
                price: item.price,
                image: item.image,
                unit: item.unit,
                quantity: item.quantity,
                subtotal: item.price * item.quantity,
                priceAccepted: true,
                negotiatedPrice: 0,
                negotiationReason: ''
            }));

            // Create order using OrderService
            const orderNumber = await OrderService.createOrder(
                user.email,
                orderItems,
                customerNote
            );

            // Clear cart after successful order creation
            await clearCart();

            // Redirect to orders page with success message
            router.push(`/orders?success=true&orderNumber=${orderNumber}`);

        } catch (err) {
            console.error('Error creating order:', err);
            alert('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // Show loading while checking auth
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">กำลังโหลดตระกร้าสินค้า...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">เกิดข้อผิดพลาด</h1>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                            กลับไปหน้าแรก
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        ตระกร้าสินค้า
                    </h1>
                    <p className="text-gray-600">
                        {cartItemCount > 0 ? `มีสินค้า ${cartItemCount} รายการ` : 'ไม่มีสินค้าในตระกร้า'}
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            ตระกร้าสินค้าว่างเปล่า
                        </h2>
                        <p className="text-gray-600 mb-6">
                            เลือกสินค้าที่ต้องการและเพิ่มลงในตระกร้า
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            เริ่มช้อปปิ้ง
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">สินค้าในตระกร้า</h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        ล้างตระกร้า
                                    </button>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-4">
                                            <div className="flex items-center space-x-4">
                                                {/* Product Image */}
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        รหัส: {item.code}
                                                    </p>
                                                    <p className="text-sm font-medium text-orange-600">
                                                        ฿{item.price.toLocaleString()} / {item.unit}
                                                    </p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="w-8 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Item Total */}
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        ฿{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                    <button
                                                        onClick={() => removeItem(item.id!)}
                                                        className="text-red-600 hover:text-red-800 text-sm mt-1"
                                                    >
                                                        ลบ
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    สรุปคำสั่งซื้อ
                                </h2>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">จำนวนสินค้า</span>
                                        <span className="font-medium">{cartItemCount} รายการ</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">ราคารวม</span>
                                        <span className="font-medium">฿{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-gray-900">ยอดรวมทั้งสิ้น</span>
                                        <span className="text-lg font-bold text-orange-600">
                                            ฿{cartTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer Note */}
                                <div className="mb-6">
                                    <label htmlFor="customerNote" className="block text-sm font-medium text-gray-700 mb-2">
                                        หมายเหตุ (ไม่บังคับ)
                                    </label>
                                    <textarea
                                        id="customerNote"
                                        value={customerNote}
                                        onChange={(e) => setCustomerNote(e.target.value)}
                                        placeholder="ระบุข้อมูลเพิ่มเติม เช่น ที่อยู่จัดส่ง หรือความต้องการพิเศษ"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    {/* Create Quotation Button */}
                                    <button
                                        onClick={() => router.push('/quotation')}
                                        disabled={cartItems.length === 0}
                                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>สร้างใบเสนอราคา</span>
                                    </button>

                                    {/* Create Order Button */}
                                    <button
                                        onClick={handleCreateOrder}
                                        disabled={isCreatingOrder || cartItems.length === 0}
                                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {isCreatingOrder ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>กำลังสั่งซื้อ...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>สั่งซื้อสินค้า</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <Link
                                    href="/"
                                    className="block text-center text-indigo-600 hover:text-indigo-800 font-medium mt-4"
                                >
                                    เลือกซื้อสินค้าเพิ่มเติม
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
