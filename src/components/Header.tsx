'use client';

import { NAVIGATION_MENU, SHOP_INFO } from '@/lib/constants';
import { useCart } from '@/lib/firebaseHooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface HeaderProps {
    showBackButton?: boolean;
    onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBackClick }) => {
    const pathname = usePathname();

    // Get cart count from Firebase (ใช้ email demo ก่อน - ในการใช้งานจริงจะได้จาก authentication)
    const { cartItemCount } = useCart('user@example.com');

    const getMenuIcon = (iconType: string) => {
        switch (iconType) {
            case 'search':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                );
            case 'cart':
                return (
                    <div className="relative">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </div>
                );
            case 'orders':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'login':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                                {SHOP_INFO.name}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600">
                                {SHOP_INFO.description}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {NAVIGATION_MENU.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {getMenuIcon(item.icon)}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Back Button */}
                    {showBackButton && (
                        <button
                            onClick={onBackClick}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors md:hidden"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            กลับ
                        </button>
                    )}
                </div>

                {/* Mobile Navigation */}
                <nav className="md:hidden mt-4 flex items-center justify-around border-t border-gray-200 pt-3">
                    {NAVIGATION_MENU.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${isActive
                                    ? 'text-indigo-700'
                                    : 'text-gray-600 hover:text-indigo-600'
                                    }`}
                            >
                                {getMenuIcon(item.icon)}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
};

export default Header;
