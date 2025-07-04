'use client';

import { Header } from '@/components';
import OrdersClient from '@/components/OrdersClient';
import { Suspense } from 'react';

export default function OrdersPage() {
    return (
        <>
            <Header />
            <Suspense fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                </div>
            }>
                <OrdersClient />
            </Suspense>
        </>
    );
}
