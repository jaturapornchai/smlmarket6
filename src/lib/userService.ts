import { get, ref, set, update } from 'firebase/database';
import { database } from './firebase';
import { User, createUserKey } from './firebaseTypes';

export class UserService {
    // Create or update user
    static async createOrUpdateUser(
        email: string,
        displayName: string
    ): Promise<void> {
        const userKey = createUserKey(email);
        const userRef = ref(database, `users/${userKey}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            // Update existing user
            await update(userRef, {
                displayName,
                lastLogin: new Date().toISOString()
            });
        } else {
            // Create new user
            const newUser: User = {
                email,
                displayName,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                totalOrders: 0,
                totalSpent: 0
            };

            await set(userRef, newUser);
        }
    }

    // Get user by email
    static async getUser(email: string): Promise<User | null> {
        const userKey = createUserKey(email);
        const userRef = ref(database, `users/${userKey}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            return snapshot.val() as User;
        }

        return null;
    }

    // Update user profile
    static async updateUserProfile(
        email: string,
        updates: Partial<Pick<User, 'displayName'>>
    ): Promise<void> {
        const userKey = createUserKey(email);
        const userRef = ref(database, `users/${userKey}`);

        await update(userRef, {
            ...updates,
            lastLogin: new Date().toISOString()
        });
    }

    // Get all users (for admin)
    static async getAllUsers(): Promise<User[]> {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const usersData = snapshot.val();
            return Object.values(usersData) as User[];
        }

        return [];
    }

    // Update user stats (called from OrderService)
    static async updateUserStats(
        email: string,
        orderTotal: number,
        incrementOrders: boolean = true
    ): Promise<void> {
        const userKey = createUserKey(email);
        const userRef = ref(database, `users/${userKey}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const user = snapshot.val() as User;
            const updates: Partial<User> = {
                totalSpent: (user.totalSpent || 0) + orderTotal,
                lastLogin: new Date().toISOString()
            };

            if (incrementOrders) {
                updates.totalOrders = (user.totalOrders || 0) + 1;
            }

            await update(userRef, updates);
        }
    }

    // Get user statistics
    static async getUserStats(email: string): Promise<{
        totalOrders: number;
        totalSpent: number;
        memberSince: string;
        lastLogin: string;
    } | null> {
        const user = await this.getUser(email);

        if (user) {
            return {
                totalOrders: user.totalOrders,
                totalSpent: user.totalSpent,
                memberSince: user.createdAt,
                lastLogin: user.lastLogin
            };
        }

        return null;
    }
}
