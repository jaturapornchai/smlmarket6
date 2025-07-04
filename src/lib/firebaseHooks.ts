import { useEffect, useState } from 'react';
import { CartService } from './cartService';
import { CartItem, Order, OrderItem, OrderStatus, User } from './firebaseTypes';
import { OrderService } from './orderService';
import { UserService } from './userService';

// Hook for cart management
export function useCart(userEmail: string) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshCart = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!userEmail) {
                setCartItems([]);
                return;
            }

            const items = await CartService.getCart(userEmail);
            setCartItems(items);
        } catch (err) {
            console.error('Error loading cart:', err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดตระกร้า');
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            refreshCart();
        }
    }, [userEmail]);

    const addToCart = async (item: Omit<CartItem, 'addedAt' | 'updatedAt' | 'id'>) => {
        try {
            if (!userEmail) {
                throw new Error('ไม่มีผู้ใช้เข้าสู่ระบบ');
            }

            await CartService.addOrUpdateProduct(userEmail, item);
            await refreshCart();
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเพิ่มสินค้า');
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            if (!userEmail) {
                throw new Error('ไม่มีผู้ใช้เข้าสู่ระบบ');
            }

            if (quantity <= 0) {
                await CartService.removeFromCart(userEmail, itemId);
            } else {
                await CartService.updateCartItem(userEmail, itemId, quantity);
            }
            await refreshCart();
        } catch (err) {
            console.error('Error updating cart:', err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตจำนวน');
        }
    };

    const removeItem = async (itemId: string) => {
        try {
            if (!userEmail) {
                throw new Error('ไม่มีผู้ใช้เข้าสู่ระบบ');
            }

            await CartService.removeFromCart(userEmail, itemId);
            await refreshCart();
        } catch (err) {
            console.error('Error removing item:', err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบสินค้า');
        }
    };

    const clearCart = async () => {
        try {
            if (!userEmail) {
                throw new Error('ไม่มีผู้ใช้เข้าสู่ระบบ');
            }

            await CartService.clearCart(userEmail);
            await refreshCart();
        } catch (err) {
            console.error('Error clearing cart:', err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการล้างตระกร้า');
        }
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return {
        cartItems,
        loading,
        error,
        cartTotal,
        cartItemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart
    };
}

// Hook for orders management
export function useOrders(userEmail: string) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshOrders = async () => {
        try {
            setLoading(true);
            const userOrders = await OrderService.getUserOrders(userEmail);
            setOrders(userOrders);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            refreshOrders();
        }
    }, [userEmail]);

    const createOrder = async (
        items: CartItem[],
        customerNote: string = ''
    ): Promise<string | null> => {
        try {
            // Convert CartItem[] to OrderItem[]
            const orderItems: OrderItem[] = items.map(item => ({
                productId: item.productId,
                name: item.name,
                code: item.code,
                price: item.price,
                image: item.image,
                unit: item.unit,
                quantity: item.quantity,
                subtotal: item.price * item.quantity,
                priceAccepted: true,
                negotiatedPrice: item.price,
                negotiationReason: ''
            }));

            const orderNumber = await OrderService.createOrder(userEmail, orderItems, customerNote);
            await refreshOrders();
            return orderNumber;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating order');
            return null;
        }
    };

    return {
        orders,
        loading,
        error,
        createOrder,
        refreshOrders
    };
}

// Hook for user management
export function useUser(email: string) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshUser = async () => {
        try {
            setLoading(true);
            const userData = await UserService.getUser(email);
            setUser(userData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading user');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (email) {
            refreshUser();
        }
    }, [email]);

    const updateProfile = async (displayName: string) => {
        try {
            await UserService.updateUserProfile(email, { displayName });
            await refreshUser();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating profile');
        }
    };

    return {
        user,
        loading,
        error,
        updateProfile,
        refreshUser
    };
}

// Hook for user orders management
export function useUserOrders(userEmail: string) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshOrders = async () => {
        try {
            setLoading(true);
            if (userEmail) {
                const userOrders = await OrderService.getUserOrders(userEmail);
                setOrders(userOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
            } else {
                setOrders([]);
            }
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshOrders();
    }, [userEmail]);

    const getOrderByNumber = (orderNumber: string) => {
        return orders.find(order => order.orderNumber === orderNumber);
    };

    const getOrdersByStatus = (status: OrderStatus) => {
        return orders.filter(order => order.status === status);
    };

    return {
        orders,
        loading,
        error,
        getOrderByNumber,
        getOrdersByStatus,
        refreshOrders
    };
}

// Hook for admin orders management
export function useAdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshOrders = async () => {
        try {
            setLoading(true);
            const allOrders = await OrderService.getAllOrders();
            setOrders(allOrders);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshOrders();
    }, []);

    const updateOrderStatus = async (orderNumber: string, status: OrderStatus, note?: string) => {
        try {
            await OrderService.updateOrderStatus(orderNumber, status, note);
            await refreshOrders();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating order status');
        }
    };

    const getOrdersByStatus = (status: OrderStatus) => {
        return orders.filter(order => order.status === status);
    };

    return {
        orders,
        loading,
        error,
        updateOrderStatus,
        getOrdersByStatus,
        refreshOrders
    };
}
