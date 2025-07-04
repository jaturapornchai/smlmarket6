'use client';

import { Product } from '@/lib/api';
import { decodeProductId } from '@/lib/productUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductDetailClient from './ProductDetailClient';
import { LoadingSpinner } from './index';

export default function ProductPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get product ID from query params
                const encodedId = searchParams.get('id');
                const encodedData = searchParams.get('data');

                if (!encodedId) {
                    setError('Product ID is required');
                    return;
                }

                // Try to decode the product ID
                try {
                    const decodedId = decodeProductId(encodedId);
                    if (decodedId && decodedId !== encodedId) {
                        console.log('Decoded product ID:', decodedId);
                    }
                } catch {
                    // If decoding fails, use the original ID
                    console.log('Using original product ID:', encodedId);
                }

                // If we have encoded product data, use it
                if (encodedData) {
                    try {
                        const decodedData = decodeURIComponent(encodedData);
                        const productData = JSON.parse(decodedData) as Product;
                        setProduct(productData);
                        return;
                    } catch {
                        console.log('Could not parse product data, will fetch from API');
                    }
                }

                // If no product data, redirect to home as we can't fetch without the API
                console.log('No product data available, redirecting to home');
                router.push('/');

            } catch (err) {
                console.error('Error loading product:', err);
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [searchParams, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-600 mb-4">Product Not Found</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return <ProductDetailClient product={product} />;
}
