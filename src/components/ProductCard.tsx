'use client';

import { Product } from '@/lib/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const hasDiscount = product.discount_percent > 0;
    const isAvailable = product.qty_available > 0;
    const router = useRouter();

    const handleClick = () => {
        // Save current scroll position and page state before navigating
        const currentState = {
            scrollY: window.scrollY,
            timestamp: Date.now()
        };
        sessionStorage.setItem('homeScrollPosition', JSON.stringify(currentState));
        
        // For now, we'll pass the product data via query params since we don't have a product-by-id API
        const productData = encodeURIComponent(JSON.stringify(product));
        router.push(`/product/${product.code}?data=${productData}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out p-1 sm:p-3 border border-gray-200 flex flex-col h-full cursor-pointer group hover:border-indigo-300 hover:-translate-y-1 hover:scale-[1.02]"
        >
            {/* Product Image */}
            <div className="w-full h-28 sm:h-32 bg-gray-100 rounded-md mb-1 sm:mb-2 flex items-center justify-center overflow-hidden group-hover:bg-gray-50 transition-colors duration-300">
                {product.img_url ? (
                    <Image
                        src={product.img_url}
                        alt={product.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-500 transition-colors duration-300">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-xs">No Image</span>
                    </div>
                )}
            </div>

            {/* Product Info - flex-grow to push price to bottom */}
            <div className="flex flex-col flex-grow space-y-1 sm:space-y-2">
                {/* Product Name - moved to top */}
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight product-name group-hover:text-indigo-600 transition-colors duration-300">
                    {product.name}
                </h3>

                {/* Product Code */}
                <div className="flex items-center">
                    <span className="text-xs sm:text-sm font-medium text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded text-center truncate">
                        {product.code}
                    </span>
                </div>

                {/* Supplier - ซ่อนในหน้าจอเล็ก */}
                <div className="hidden sm:flex items-center text-xs text-gray-600">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {product.supplier_code}
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-xs font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {isAvailable ? `คงเหลือ ${product.qty_available} ${product.unit}` : 'สินค้าหมด'}
                        </span>
                    </div>
                </div>

                {/* Barcode - ซ่อนในหน้าจอเล็ก */}
                {product.barcode && (
                    <div className="hidden sm:block text-xs text-gray-500 font-mono bg-gray-50 px-1 py-0.5 rounded truncate">
                        {product.barcode}
                    </div>
                )}

                {/* Spacer to push price to bottom */}
                <div className="flex-grow"></div>

                {/* Price Section - moved to bottom with larger font */}
                <div className="space-y-1 pt-1 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                            {product.final_price === 0 ? (
                                <span className="text-sm sm:text-base font-bold text-gray-500">
                                    ไม่มีราคา
                                </span>
                            ) : hasDiscount ? (
                                <>
                                    <span className="text-sm sm:text-base font-bold text-orange-600">
                                        ฿{product.final_price.toLocaleString()}
                                    </span>
                                    <span className="text-sm sm:text-base font-bold text-orange-600">
                                        / {product.unit}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through ml-2">
                                        ฿{product.sale_price.toLocaleString()}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm sm:text-base font-bold text-orange-600">
                                        ฿{product.final_price.toLocaleString()}
                                    </span>
                                    <span className="text-sm sm:text-base font-bold text-orange-600">
                                        / {product.unit}
                                    </span>
                                </>
                            )}
                        </div>

                        {hasDiscount && product.final_price > 0 && (
                            <div className="text-right">
                                <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-1 py-0.5 rounded">
                                    -{product.discount_percent}%
                                </span>
                            </div>
                        )}

                        {product.final_price === 0 && (
                            <div className="text-right">
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-1 py-0.5 rounded">
                                    ไม่มีราคา
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
