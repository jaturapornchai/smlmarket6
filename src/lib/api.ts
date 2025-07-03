
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

    return await response.json();
};

export type { Product, SearchRequest, SearchResponse };

