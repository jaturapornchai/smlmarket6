import { get, push, ref, remove, set, update } from 'firebase/database';
import { database } from './firebase';
import { CartItem, createUserKey } from './firebaseTypes';

export class CartService {
    // Add item to cart
    static async addToCart(userEmail: string, item: Omit<CartItem, 'addedAt' | 'updatedAt'>): Promise<void> {
        const userKey = createUserKey(userEmail);
        const cartRef = ref(database, `carts/${userKey}`);
        const newItemRef = push(cartRef);

        const cartItem: CartItem = {
            ...item,
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await set(newItemRef, cartItem);
    }

    // Get user's cart
    static async getCart(userEmail: string): Promise<CartItem[]> {
        const userKey = createUserKey(userEmail);
        const cartRef = ref(database, `carts/${userKey}`);
        const snapshot = await get(cartRef);

        if (snapshot.exists()) {
            const cartData = snapshot.val();
            return Object.entries(cartData).map(([id, item]) => ({
                ...item as CartItem,
                id // Add the Firebase key as id
            }));
        }

        return [];
    }

    // Update cart item quantity
    static async updateCartItem(userEmail: string, itemId: string, quantity: number): Promise<void> {
        const userKey = createUserKey(userEmail);
        const itemRef = ref(database, `carts/${userKey}/${itemId}`);

        await update(itemRef, {
            quantity,
            updatedAt: new Date().toISOString()
        });
    }

    // Remove item from cart
    static async removeFromCart(userEmail: string, itemId: string): Promise<void> {
        const userKey = createUserKey(userEmail);
        const itemRef = ref(database, `carts/${userKey}/${itemId}`);
        await remove(itemRef);
    }

    // Clear entire cart
    static async clearCart(userEmail: string): Promise<void> {
        const userKey = createUserKey(userEmail);
        const cartRef = ref(database, `carts/${userKey}`);
        await remove(cartRef);
    }

    // Get cart item count
    static async getCartItemCount(userEmail: string): Promise<number> {
        const cartItems = await this.getCart(userEmail);
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart total price
    static async getCartTotal(userEmail: string): Promise<number> {
        const cartItems = await this.getCart(userEmail);
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Check if product exists in cart
    static async isProductInCart(userEmail: string, productId: string): Promise<boolean> {
        const cartItems = await this.getCart(userEmail);
        return cartItems.some(item => item.productId === productId);
    }

    // Update existing product quantity or add new product
    static async addOrUpdateProduct(userEmail: string, product: Omit<CartItem, 'addedAt' | 'updatedAt'>): Promise<void> {
        const cartItems = await this.getCart(userEmail);
        const existingItem = cartItems.find(item => item.productId === product.productId);

        if (existingItem && existingItem.id) {
            // Update quantity of existing item
            await this.updateCartItem(userEmail, existingItem.id, existingItem.quantity + product.quantity);
        } else {
            // Add new item
            await this.addToCart(userEmail, product);
        }
    }
}
