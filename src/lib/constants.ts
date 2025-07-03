// Shop information constants
export const SHOP_INFO = {
    name: 'ร้ายเอกชัยอะไหล่',
    description: 'ศูนยรวมอะไหล่'
} as const;

// Welcome message constants
export const WELCOME_MESSAGE = {
    title: 'ยินดีต้อนรับสู่ SML Market',
    subtitle: 'ค้นหาสินค้าด้วยเทคโนโลยี AI ที่รองรับภาษาไทยและอังกฤษ'
} as const;

// Navigation menu constants
export const NAVIGATION_MENU = [
    { name: 'ค้นหา', href: '/', icon: 'search' },
    { name: 'ตระกร้า', href: '/cart', icon: 'cart' },
    { name: 'ใบสั่งซื้อ', href: '/orders', icon: 'orders' },
    { name: 'เข้าสู่ระบบ', href: '/login', icon: 'login' }
] as const;
