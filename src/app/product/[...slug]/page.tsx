import ProductDetailClient from '@/components/ProductDetailClient';
import { Product } from '@/lib/api';
import { isValidProductCode } from '@/lib/productUtils';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: Promise<{
        slug: string[];
    }>;
    searchParams: Promise<{
        data?: string;
    }>;
}

// Generate static params for static export
export async function generateStaticParams() {
    // Return empty array since we can't pre-generate all possible product routes
    // The routes will be generated on-demand
    return [];
}

// This would normally fetch from an API or database
async function getProduct(id: string, productData?: string): Promise<Product | null> {
    console.log('Getting product with ID:', id);
    console.log('Product data available:', !!productData);

    // If we have product data in query params, use it
    if (productData) {
        try {
            const parsed = JSON.parse(decodeURIComponent(productData));
            console.log('Parsed product data successfully:', parsed.name);

            // Validate that the parsed data has the expected structure
            if (parsed.code && parsed.name && typeof parsed.price === 'number') {
                return parsed;
            } else {
                console.error('Invalid product data structure:', parsed);
                return null;
            }
        } catch (error) {
            console.error('Error parsing product data:', error);
            console.error('Raw product data:', productData);
            return null;
        }
    }

    console.log('No product data found in query params');

    // Try to create a fallback product based on the ID
    // This is a temporary solution - in production, you'd fetch from API
    if (id && id.length > 0) {
        console.log('Creating fallback product for ID:', id);
        return {
            id: id,
            name: `Product ${id}`,
            code: id,
            price: 0,
            balance_qty: 0,
            supplier_code: 'N/A',
            unit: 'unit',
            img_url: '/demo-images/auto-parts/auto-part-1.jpg',
            search_priority: 1,
            sale_price: 0,
            premium_word: 'N/A',
            discount_price: 0,
            discount_percent: 0,
            final_price: 0,
            sold_qty: 0,
            multi_packing: 0,
            multi_packing_name: 'N/A',
            barcodes: 'N/A',
            barcode: '',
            qty_available: 0,
            similarity_score: 0
        };
    }

    return null;
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    console.log('Product page params:', resolvedParams);
    console.log('Product page searchParams:', resolvedSearchParams);

    // Join the slug parts to reconstruct the full product code
    const productId = resolvedParams.slug.join('/');
    console.log('Reconstructed product ID from slug:', productId);

    // If we have product data, try to extract the real product code from it
    let finalId = productId;
    if (resolvedSearchParams.data) {
        try {
            const parsed = JSON.parse(decodeURIComponent(resolvedSearchParams.data));
            if (parsed.code) {
                finalId = parsed.code;
                console.log('Using product code from data:', finalId);
            }
        } catch (error) {
            console.error('Error parsing product data for code extraction:', error);
        }
    }

    console.log('Final product ID:', finalId);

    // Validate product code
    if (!isValidProductCode(finalId)) {
        console.error('Invalid product code:', finalId);
        console.error('Original slug:', resolvedParams.slug);
        console.error('Reconstructed ID:', productId);
        notFound();
    }

    const product = await getProduct(finalId, resolvedSearchParams.data);

    if (!product) {
        console.error('Product not found:', finalId);
        console.error('Available product data:', resolvedSearchParams.data ? 'Yes' : 'No');
        notFound();
    }

    console.log('Product loaded successfully:', product.name);
    return <ProductDetailClient product={product} />;
}
