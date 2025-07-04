/**
 * Utility functions for handling product URLs and encoding
 */

/**
 * Create a safe product URL using base64 encoding
 */
export function createProductUrl(productCode: string, productData?: Record<string, unknown>): string {
    // Use base64 encoding for the product code to handle special characters
    const encodedCode = encodeProductId(productCode);
    const baseUrl = `/product/${encodedCode}`;

    if (productData) {
        const encodedData = encodeURIComponent(JSON.stringify(productData));
        return `${baseUrl}?data=${encodedData}`;
    }

    return baseUrl;
}

/**
 * Validate if a product code is safe for URLs
 */
export function isValidProductCode(code: string): boolean {
    if (!code || typeof code !== 'string') {
        return false;
    }

    // Check for extremely long codes or potentially problematic characters
    if (code.length > 200) {
        return false;
    }

    return true;
}

/**
 * Encode product code using base64 encoding
 */
export function encodeProductId(productCode: string): string {
    if (!productCode || typeof productCode !== 'string') {
        console.error('Invalid product code for encoding:', productCode);
        return '';
    }

    try {
        // Use pure base64 encoding for better URL safety
        return btoa(unescape(encodeURIComponent(productCode)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    } catch (error) {
        console.error('Error encoding product code:', error);
        return '';
    }
}

/**
 * Decode product code from base64 encoding
 */
export function decodeProductId(encodedCode: string): string {
    if (!encodedCode || typeof encodedCode !== 'string') {
        console.error('Invalid encoded code for decoding:', encodedCode);
        return '';
    }

    try {
        // Restore base64 padding and characters
        const base64 = encodedCode.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
        return decodeURIComponent(escape(atob(padded)));
    } catch (error) {
        console.error('Error decoding product ID:', error);
        console.error('Input encoded code:', encodedCode);
        return encodedCode; // Return original if decode fails
    }
}
