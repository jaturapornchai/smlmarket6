import { get, ref, set, update } from 'firebase/database';
import { database } from './firebase';
import {
    Order,
    OrderItem,
    OrderStatus,
    PriceNegotiation,
    TimelineEntry,
    createUserKey,
    generateOrderNumber,
    getDateKey
} from './firebaseTypes';

export class OrderService {
    // Create new order
    static async createOrder(
        userEmail: string,
        items: OrderItem[],
        customerNote: string = '',
        priceNegotiation?: PriceNegotiation
    ): Promise<string> {
        const userKey = createUserKey(userEmail);
        const now = new Date();
        const dateKey = getDateKey(now);

        // Get and increment order counter
        const counterRef = ref(database, `counters/orderNumber/${dateKey}`);
        const counterSnapshot = await get(counterRef);
        const currentCounter = counterSnapshot.exists() ? counterSnapshot.val() : 0;
        const newCounter = currentCounter + 1;

        // Update counter
        await set(counterRef, newCounter);

        // Generate order number
        const orderNumber = generateOrderNumber(now, newCounter);

        // Calculate totals
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const acceptedTotal = items
            .filter(item => item.priceAccepted)
            .reduce((sum, item) => sum + item.subtotal, 0);
        const negotiatedTotal = items
            .filter(item => !item.priceAccepted)
            .reduce((sum, item) => sum + (item.negotiatedPrice * item.quantity), 0);

        // Create order object
        const order: Order = {
            orderNumber,
            userEmail,
            userId: userKey,
            status: 'pending',
            orderDate: now.toISOString(),
            totalItems,
            acceptedTotal,
            negotiatedTotal,
            items,
            customerNote,
            priceNegotiation: priceNegotiation || {
                hasNegotiation: false,
                requestedTotal: 0,
                reason: ''
            },
            timeline: [{
                status: 'pending',
                timestamp: now.toISOString(),
                note: 'ใบสั่งซื้อถูกสร้างและส่งให้ทางร้านแล้ว'
            }],
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        };

        // Save order
        const orderRef = ref(database, `orders/${orderNumber}`);
        await set(orderRef, order);

        // Update user stats
        await this.updateUserStats(userEmail, acceptedTotal + negotiatedTotal);

        return orderNumber;
    }

    // Get order by order number
    static async getOrder(orderNumber: string): Promise<Order | null> {
        const orderRef = ref(database, `orders/${orderNumber}`);
        const snapshot = await get(orderRef);

        if (snapshot.exists()) {
            return snapshot.val() as Order;
        }

        return null;
    }

    // Get user's orders
    static async getUserOrders(userEmail: string): Promise<Order[]> {
        const userKey = createUserKey(userEmail);
        const ordersRef = ref(database, 'orders');
        const snapshot = await get(ordersRef);

        if (snapshot.exists()) {
            const ordersData = snapshot.val();
            return (Object.values(ordersData) as Order[])
                .filter((order: Order) => order.userId === userKey)
                .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return [];
    }

    // Update order status
    static async updateOrderStatus(orderNumber: string, newStatus: OrderStatus, note: string = ''): Promise<void> {
        const orderRef = ref(database, `orders/${orderNumber}`);
        const snapshot = await get(orderRef);

        if (snapshot.exists()) {
            const order = snapshot.val() as Order;
            const timelineEntry: TimelineEntry = {
                status: newStatus,
                timestamp: new Date().toISOString(),
                note: note || this.getDefaultStatusNote(newStatus)
            };

            const updatedOrder = {
                ...order,
                status: newStatus,
                timeline: [...order.timeline, timelineEntry],
                updatedAt: new Date().toISOString()
            };

            await set(orderRef, updatedOrder);
        }
    }

    // Update order with negotiated prices
    static async updateOrderWithNegotiation(
        orderNumber: string,
        negotiatedItems: { productId: string; negotiatedPrice: number; reason: string }[]
    ): Promise<void> {
        const orderRef = ref(database, `orders/${orderNumber}`);
        const snapshot = await get(orderRef);

        if (snapshot.exists()) {
            const order = snapshot.val() as Order;

            // Update items with negotiated prices
            const updatedItems = order.items.map(item => {
                const negotiation = negotiatedItems.find(n => n.productId === item.productId);
                if (negotiation) {
                    return {
                        ...item,
                        priceAccepted: false,
                        negotiatedPrice: negotiation.negotiatedPrice,
                        negotiationReason: negotiation.reason
                    };
                }
                return item;
            });

            // Recalculate totals
            const acceptedTotal = updatedItems
                .filter(item => item.priceAccepted)
                .reduce((sum, item) => sum + item.subtotal, 0);
            const negotiatedTotal = updatedItems
                .filter(item => !item.priceAccepted)
                .reduce((sum, item) => sum + (item.negotiatedPrice * item.quantity), 0);

            const updatedOrder = {
                ...order,
                items: updatedItems,
                acceptedTotal,
                negotiatedTotal,
                priceNegotiation: {
                    hasNegotiation: true,
                    requestedTotal: negotiatedTotal,
                    reason: negotiatedItems.map(n => n.reason).join(', ')
                },
                updatedAt: new Date().toISOString()
            };

            await set(orderRef, updatedOrder);
        }
    }

    // Get all orders (for admin)
    static async getAllOrders(): Promise<Order[]> {
        const ordersRef = ref(database, 'orders');
        const snapshot = await get(ordersRef);

        if (snapshot.exists()) {
            const ordersData = snapshot.val();
            return (Object.values(ordersData) as Order[])
                .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return [];
    }

    // Get orders by status
    static async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
        const allOrders = await this.getAllOrders();
        return allOrders.filter(order => order.status === status);
    }

    // Update user statistics
    private static async updateUserStats(userEmail: string, orderTotal: number): Promise<void> {
        const userKey = createUserKey(userEmail);
        const userRef = ref(database, `users/${userKey}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const user = snapshot.val();
            await update(userRef, {
                totalOrders: (user.totalOrders || 0) + 1,
                totalSpent: (user.totalSpent || 0) + orderTotal,
                lastLogin: new Date().toISOString()
            });
        }
    }

    // Get default status note
    private static getDefaultStatusNote(status: OrderStatus): string {
        const statusNotes = {
            'pending': 'ใบสั่งซื้อถูกสร้างและส่งให้ทางร้านแล้ว',
            'confirmed': 'ทางร้านยืนยันการสั่งซื้อแล้ว',
            'processing': 'กำลังเตรียมสินค้าให้ลูกค้า',
            'shipped': 'สินค้าถูกจัดส่งแล้ว',
            'delivered': 'สินค้าถูกส่งมอบเรียบร้อยแล้ว',
            'cancelled': 'ยกเลิกการสั่งซื้อ'
        };

        return statusNotes[status] || '';
    }
}
