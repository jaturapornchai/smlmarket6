'use client';

import { decodeProductId, encodeProductId } from '@/lib/productUtils';
import { useState } from 'react';

export default function TestProductUrl() {
    const [productCode, setProductCode] = useState('HONDA-003/1');
    const [encodedCode, setEncodedCode] = useState('');
    const [decodedCode, setDecodedCode] = useState('');
    const [testResult, setTestResult] = useState('');

    const handleTest = () => {
        try {
            const encoded = encodeProductId(productCode);
            setEncodedCode(encoded);

            const decoded = decodeProductId(encoded);
            setDecodedCode(decoded);

            const matches = decoded === productCode;
            setTestResult(matches ? 'SUCCESS' : 'FAILED');

            console.log('Test Results:');
            console.log('Original:', productCode);
            console.log('Encoded:', encoded);
            console.log('Decoded:', decoded);
            console.log('Match:', matches);
        } catch (error) {
            console.error('Test error:', error);
            setTestResult('ERROR');
        }
    };

    const testCodes = [
        'HONDA-003/1',
        'BMW-456+ABC',
        'TOYOTA#789',
        'NISSAN\'s-PART',
        'SPECIAL/CHARS+123#456',
        'NORMAL-CODE-123'
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Product URL Encoding Test</h1>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Code
                            </label>
                            <input
                                type="text"
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleTest}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Test Encoding/Decoding
                        </button>

                        {encodedCode && (
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Encoded:</label>
                                    <div className="bg-gray-100 p-2 rounded text-mono break-all">{encodedCode}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Decoded:</label>
                                    <div className="bg-gray-100 p-2 rounded text-mono break-all">{decodedCode}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Result:</label>
                                    <div className={`p-2 rounded font-bold ${testResult === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                                            testResult === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {testResult}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Batch Test</h2>
                    <div className="space-y-2">
                        {testCodes.map((code) => {
                            const encoded = encodeProductId(code);
                            const decoded = decodeProductId(encoded);
                            const matches = decoded === code;

                            return (
                                <div key={code} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div className="flex-1">
                                        <div className="font-mono text-sm">{code}</div>
                                        <div className="text-xs text-gray-500">→ {encoded}</div>
                                        <div className="text-xs text-gray-500">→ {decoded}</div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold ${matches ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {matches ? 'OK' : 'FAIL'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
