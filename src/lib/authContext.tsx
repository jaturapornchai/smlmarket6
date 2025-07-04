'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, name: string) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Load user from localStorage on component mount
        const savedUser = localStorage.getItem('smlmarket_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('smlmarket_user');
                // Set default test user for convenience
                const defaultUser = { email: 'test01@gmail.com', name: 'Test User' };
                setUser(defaultUser);
                localStorage.setItem('smlmarket_user', JSON.stringify(defaultUser));
            }
        } else {
            // Set default test user for convenience when no saved user
            const defaultUser = { email: 'test01@gmail.com', name: 'Test User' };
            setUser(defaultUser);
            localStorage.setItem('smlmarket_user', JSON.stringify(defaultUser));
        }
    }, []);

    const login = (email: string, name: string) => {
        const userData = { email, name };
        setUser(userData);
        localStorage.setItem('smlmarket_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('smlmarket_user');
        // Clear cart data on logout
        localStorage.removeItem('cart');
    };

    const isLoggedIn = user !== null;

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
