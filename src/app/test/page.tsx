'use client';

import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/firebaseHooks';
import { useState } from 'react';

export default function TestPage() {
    const { user } = useAuth();
    const { cartItems, cartTotal, loading, error, addToCart, clearCart } = useCart(user?.email || '');
    const [testResult, setTestResult] = useState('');

    const testAddToCart = async () => {
        try {
            await addToCart({
                productId: 'test-product-1',
                name: 'Test Product',
                code: 'TEST001',
                price: 100,
                image: '/placeholder.png',
                unit: 'ชิ้น',
                quantity: 1
            });
            setTestResult('เพิ่มสินค้าเข้าตระกร้าเรียบร้อย');
        } catch (err) {
            setTestResult('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const testAddMultipleItems = async () => {
        try {
            // Add multiple test items
            const testItems = [
                {
                    productId: 'test-product-1',
                    name: 'ชุดเบรค Toyota Camry',
                    code: 'BRK001',
                    price: 2500,
                    image: '/placeholder.png',
                    unit: 'ชุด',
                    quantity: 1
                },
                {
                    productId: 'test-product-2',
                    name: 'ผ้าเบรค Honda Civic',
                    code: 'PAD002',
                    price: 800,
                    image: '/placeholder.png',
                    unit: 'ชิ้น',
                    quantity: 2
                },
                {
                    productId: 'test-product-3',
                    name: 'กรองอากาศ Nissan Altima',
                    code: 'FIL003',
                    price: 350,
                    image: '/placeholder.png',
                    unit: 'ชิ้น',
                    quantity: 1
                }
            ];

            for (const item of testItems) {
                await addToCart(item);
            }
            setTestResult('เพิ่มสินค้าทดสอบ 3 รายการเรียบร้อย');
        } catch (err) {
            setTestResult('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const testClearCart = async () => {
        try {
            await clearCart();
            setTestResult('ล้างตระกร้าเรียบร้อย');
        } catch (err) {
            setTestResult('เกิดข้อผิดพลาด: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Page</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">User Info</h2>
                    <p>Email: {user?.email}</p>
                    <p>Name: {user?.name}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Cart Status</h2>
                    <p>Loading: {loading ? 'Yes' : 'No'}</p>
                    <p>Error: {error || 'None'}</p>
                    <p>Items count: {cartItems.length}</p>
                    <p>Total: ฿{cartTotal}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
                    <div className="space-y-3">
                        <button
                            onClick={testAddToCart}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
                        >
                            Test Add to Cart
                        </button>
                        <button
                            onClick={testAddMultipleItems}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4"
                        >
                            Add Multiple Items
                        </button>
                        <button
                            onClick={testClearCart}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Clear Cart
                        </button>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">{testResult}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                    {cartItems.length === 0 ? (
                        <p>No items in cart</p>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="border-b pb-4">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Code: {item.code}</p>
                                    <p className="text-sm text-gray-600">Price: ฿{item.price}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
