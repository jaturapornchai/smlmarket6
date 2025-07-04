'use client';

import { QuotationData, QuotationDocument } from '@/lib/pdfReactRendererLocal';
import { PDFViewer } from '@react-pdf/renderer';
import { useState } from 'react';

interface PDFPreviewProps {
    data: QuotationData;
    onClose: () => void;
}

export default function PDFPreview({ data, onClose }: PDFPreviewProps) {
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        ตัวอย่างใบเสนอราคา PDF
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 p-4">
                    {error ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={() => setError(null)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    ลองใหม่
                                </button>
                            </div>
                        </div>
                    ) : (
                        <PDFViewer
                            width="100%"
                            height="100%"
                            showToolbar={true}
                        >
                            <QuotationDocument data={data} />
                        </PDFViewer>
                    )}
                </div>
            </div>
        </div>
    );
}
