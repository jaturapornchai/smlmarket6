// Firebase Database Types
export interface CartItem {
    id?: string; // Firebase key
    productId: string;
    name: string;
    code: string;
    price: number;
    image: string;
    unit: string;
    quantity: number;
    addedAt: string;
    updatedAt: string;
}

export interface Cart {
    [itemId: string]: CartItem;
}

export interface OrderItem {
    productId: string;
    name: string;
    code: string;
    price: number;
    image: string;
    unit: string;
    quantity: number;
    subtotal: number;
    priceAccepted: boolean;
    negotiatedPrice: number;
    negotiationReason: string;
}

export interface TimelineEntry {
    status: OrderStatus;
    timestamp: string;
    note: string;
}

export interface PriceNegotiation {
    hasNegotiation: boolean;
    requestedTotal: number;
    reason: string;
}

export interface Order {
    orderNumber: string;
    userEmail: string;
    userId: string;
    status: OrderStatus;
    orderDate: string;
    totalItems: number;
    acceptedTotal: number;
    negotiatedTotal: number;
    items: OrderItem[];
    customerNote: string;
    priceNegotiation: PriceNegotiation;
    timeline: TimelineEntry[];
    createdAt: string;
    updatedAt: string;
}

export interface User {
    email: string;
    displayName: string;
    createdAt: string;
    lastLogin: string;
    totalOrders: number;
    totalSpent: number;
}

export interface OrderCounter {
    [dateKey: string]: number;
}

export interface DatabaseSchema {
    carts: {
        [userKey: string]: Cart;
    };
    orders: {
        [orderNumber: string]: Order;
    };
    counters: {
        orderNumber: OrderCounter;
    };
    users: {
        [userKey: string]: User;
    };
}

export type OrderStatus =
    | 'pending'      // รอการยืนยัน
    | 'confirmed'    // ยืนยันแล้ว
    | 'processing'   // กำลังเตรียมสินค้า
    | 'shipped'      // จัดส่งแล้ว
    | 'delivered'    // ส่งมอบแล้ว
    | 'cancelled';   // ยกเลิก

// Helper function to create user key from email
export function createUserKey(email: string): string {
    return email.replace(/[.@]/g, '_');
}

// Helper function to generate order number
export function generateOrderNumber(date: Date, counter: number): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const orderNum = counter.toString().padStart(4, '0');

    return `${year}${month}${day}-${orderNum}`;
}

// Helper function to get date key for counter
export function getDateKey(date: Date): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
}
