'use client';

import { useCart, useOrders, useUser } from '@/lib/firebaseHooks';
import { UserService } from '@/lib/userService';
import { useState } from 'react';

// Example component showing how to use Firebase services
export default function FirebaseExample() {
    const [userEmail, setUserEmail] = useState('test@example.com');

    // Use Firebase hooks
    const { cartItems, cartTotal, cartItemCount, addToCart, updateQuantity, removeItem, clearCart } = useCart(userEmail);
    const { orders, createOrder } = useOrders(userEmail);
    const { user, updateProfile } = useUser(userEmail);

    // Example functions
    const handleAddToCart = async () => {
        await addToCart({
            productId: 'BRAKE-001',
            name: 'ผ้าเบรคหน้า TOYOTA VIGO',
            code: 'BRAKE-001',
            price: 850,
            image: '/demo-images/auto-parts/auto-part-1.jpg',
            unit: 'ชุด',
            quantity: 1
        });
    };

    const handleCreateOrder = async () => {
        if (cartItems.length > 0) {
            const orderItems = cartItems.map(item => ({
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

            const orderNumber = await createOrder(orderItems, 'ขอใบกำกับภาษีด้วยครับ');
            if (orderNumber) {
                await clearCart();
                alert(`สร้างออเดอร์สำเร็จ: ${orderNumber}`);
            }
        }
    };

    const handleCreateUser = async () => {
        await UserService.createOrUpdateUser(userEmail, 'ผู้ใช้ทดสอบ');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Firebase Database Example</h1>

            {/* User Section */}
            <div className="mb-8 p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <div className="space-y-2">
                    <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Enter email"
                        className="border p-2 rounded w-full"
                    />
                    <button
                        onClick={handleCreateUser}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create/Update User
                    </button>
                    {user && (
                        <div className="mt-2 p-2 bg-gray-100 rounded">
                            <p>Name: {user.displayName}</p>
                            <p>Email: {user.email}</p>
                            <p>Total Orders: {user.totalOrders}</p>
                            <p>Total Spent: ฿{user.totalSpent.toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Section */}
            <div className="mb-8 p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                    Cart Management (Items: {cartItemCount}, Total: ฿{cartTotal.toLocaleString()})
                </h2>
                <div className="space-y-2">
                    <button
                        onClick={handleAddToCart}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Add Sample Item to Cart
                    </button>
                    <button
                        onClick={clearCart}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                    >
                        Clear Cart
                    </button>
                </div>

                {cartItems.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Cart Items:</h3>
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-2 border rounded mb-2">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">฿{item.price.toLocaleString()} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                                        className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                                        className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.id!)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Section */}
            <div className="mb-8 p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                    Order Management (Total Orders: {orders.length})
                </h2>
                <button
                    onClick={handleCreateOrder}
                    disabled={cartItems.length === 0}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
                >
                    Create Order from Cart
                </button>

                {orders.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Recent Orders:</h3>
                        {orders.slice(0, 5).map((order) => (
                            <div key={order.orderNumber} className="p-3 border rounded mb-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">Order #{order.orderNumber}</p>
                                        <p className="text-sm text-gray-600">
                                            Status: {order.status} | Items: {order.totalItems} |
                                            Total: ฿{(order.acceptedTotal + order.negotiatedTotal).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-sm ${order.status === 'pending' ? 'bg-yellow-200' :
                                            order.status === 'confirmed' ? 'bg-green-200' :
                                                order.status === 'cancelled' ? 'bg-red-200' : 'bg-blue-200'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
