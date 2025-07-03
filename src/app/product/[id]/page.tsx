import ProductDetailClient from '@/components/ProductDetailClient';
import { Product } from '@/lib/api';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        data?: string;
    }>;
}

// This would normally fetch from an API or database
async function getProduct(id: string, productData?: string): Promise<Product | null> {
    // If we have product data in query params, use it
    if (productData) {
        try {
            return JSON.parse(decodeURIComponent(productData));
        } catch (error) {
            console.error('Error parsing product data:', error);
            return null;
        }
    }

    // In a real app, you'd fetch the product details from your API
    // For now, we'll return null since we don't have a product-by-id API
    return null;
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const product = await getProduct(resolvedParams.id, resolvedSearchParams.data);

    if (!product) {
        notFound();
    }

    return <ProductDetailClient product={product} />;
}
