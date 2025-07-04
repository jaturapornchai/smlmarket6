#!/usr/bin/env node

// Simple test script to verify base64 encoding/decoding for product codes
const testCodes = [
    'ABC123',
    'DEF/456',
    'GHI#789',
    'JKL+MNO',
    'PQR=STU',
    'VWX YZ',
    'สินค้า001',
    'A&B/C#D+E=F',
    'test@example.com',
    'part-no/123/456'
];

// Base64 encode function (matching the app logic)
function encodeProductId(productCode) {
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

// Base64 decode function (matching the app logic)
function decodeProductId(encodedCode) {
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

console.log('Testing Base64 Product Code Encoding/Decoding');
console.log('='.repeat(50));

let allTestsPassed = true;

testCodes.forEach((code, index) => {
    console.log(`\nTest ${index + 1}: "${code}"`);
    const encoded = encodeProductId(code);
    const decoded = decodeProductId(encoded);

    console.log(`  Encoded: "${encoded}"`);
    console.log(`  Decoded: "${decoded}"`);
    console.log(`  Match: ${code === decoded ? '✅' : '❌'}`);

    if (code !== decoded) {
        allTestsPassed = false;
        console.log(`  ERROR: Original "${code}" !== Decoded "${decoded}"`);
    }
});

console.log('\n' + '='.repeat(50));
console.log(`Overall Result: ${allTestsPassed ? '✅ All tests passed!' : '❌ Some tests failed!'}`);
