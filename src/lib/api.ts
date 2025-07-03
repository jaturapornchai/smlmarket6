
import { getRandomAutoPartImage } from './imageUtils';

interface Product {
    id: string;
    code: string;
    name: string;
    price: number;
    unit: string;
    supplier_code: string;
    img_url: string;
    similarity_score: number;
    sale_price: number;
    premium_word: string;
    discount_price: number;
    discount_percent: number;
    final_price: number;
    sold_qty: number;
    multi_packing: number;
    multi_packing_name: string;
    barcodes: string;
    barcode: string;
    qty_available: number;
    balance_qty: number;
    search_priority: number;
}

interface SearchResponse {
    success: boolean;
    data: {
        data: Product[];
        total_count: number;
        query: string;
        duration: number;
    };
    message: string;
}

interface SearchRequest {
    query: string;
    limit?: number;
    offset?: number;
}

const API_BASE_URL = 'https://smlgoapi.dedepos.com';

export const searchProducts = async (
    query: string,
    limit: number = 20,
    offset: number = 0
): Promise<SearchResponse> => {
    const requestBody: SearchRequest = {
        query,
        limit,
        offset
    };

    const response = await fetch(`${API_BASE_URL}/v1/search-by-vector`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SearchResponse = await response.json();

    // Modify data for demo purposes
    if (data.success && data.data.data) {
        data.data.data = data.data.data.map(product => {
            // Random quantity between 6 and 999 (> 5 and < 1000)
            const randomQty = Math.floor(Math.random() * 994) + 6;

            // Random price between 100 and 10000
            const randomPrice = Math.floor(Math.random() * 9901) + 100;

            // Calculate discount (keep original discount percent if exists)
            const discountPercent = product.discount_percent || 0;
            const salePrice = discountPercent > 0 ? Math.floor(randomPrice / (1 - discountPercent / 100)) : randomPrice;
            const finalPrice = randomPrice;

            // Get random demo image for auto parts
            const demoImage = getRandomAutoPartImage();

            return {
                ...product,
                qty_available: randomQty,
                balance_qty: randomQty,
                price: randomPrice,
                sale_price: salePrice,
                final_price: finalPrice,
                discount_price: discountPercent > 0 ? randomPrice : salePrice,
                img_url: demoImage // Replace with demo image
            };
        });
    }

    return data;
};

export type { Product, SearchRequest, SearchResponse };

