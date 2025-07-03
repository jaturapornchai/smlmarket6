'use client';

import { Header } from '@/components';
import { Product } from '@/lib/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [quantity, setQuantity] = useState(1);
    const [quantityInput, setQuantityInput] = useState('1'); // Separate state for input display
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const router = useRouter();

    const handleBackClick = () => {
        // Use browser back to maintain state
        router.back();
    };

    const handleQuantityChange = (increment: boolean) => {
        const newQuantity = increment ? quantity + 1 : Math.max(quantity - 1, 1);
        setQuantity(newQuantity);
        setQuantityInput(newQuantity.toString());
    };

    const handleQuantityInput = (value: string) => {
        setQuantityInput(value); // Always update input display

        // If empty, don't update quantity yet (wait for blur or valid input)
        if (value === '') {
            return;
        }

        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 1) {
            setQuantity(numValue);
        }
    };

    const handleQuantityBlur = () => {
        // On blur, if input is empty or invalid, reset to current quantity
        if (quantityInput === '' || isNaN(parseInt(quantityInput, 10)) || parseInt(quantityInput, 10) < 1) {
            setQuantityInput(quantity.toString());
        } else {
            const numValue = parseInt(quantityInput, 10);
            setQuantity(numValue);
            setQuantityInput(numValue.toString());
        }
    };

    const handleAddToCart = async () => {
        // Prevent adding to cart if price is zero
        if (product.final_price === 0) {
            alert('ไม่สามารถเพิ่มสินค้าที่ไม่มีราคาลงในตระกร้าได้');
            return;
        }

        setIsAddingToCart(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Here you would typically add to cart via API or context
        // For now, we'll just show a success message
        alert(`เพิ่ม ${product.name} จำนวน ${quantity} ${product.unit} ลงในตระกร้าเรียบร้อย`);

        setIsAddingToCart(false);
    };

    const totalPrice = product.final_price * quantity;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header showBackButton={true} onBackClick={handleBackClick} />

            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={handleBackClick}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        กลับไปหน้าหลัก
                    </button>
                </div>

                {/* Product Details */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                        {/* Product Image */}
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            {product.img_url ? (
                                <Image
                                    src={product.img_url}
                                    alt={product.name}
                                    width={400}
                                    height={400}
                                    className="w-full h-full object-cover rounded-lg"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span className="text-lg">ไม่มีรูปภาพ</span>
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-gray-600">รหัสสินค้า:</span>
                                        <span className="text-lg font-bold text-indigo-600">{product.code}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-gray-600">ผู้จำหน่าย:</span>
                                        <span className="text-lg text-gray-900">{product.supplier_code}</span>
                                    </div>

                                    {product.barcode && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-medium text-gray-600">บาร์โค้ด:</span>
                                            <span className="text-lg font-mono text-gray-900">{product.barcode}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-gray-600">สถานะ:</span>
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-3 h-3 rounded-full ${product.qty_available > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className={`text-lg font-medium ${product.qty_available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.qty_available > 0 ? `คงเหลือ ${product.qty_available} ${product.unit}` : 'สินค้าหมด'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xl font-medium text-gray-600">ราคา:</span>
                                    <div className="text-right">
                                        {product.discount_percent > 0 ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl font-bold text-orange-600">
                                                        ฿{product.final_price.toLocaleString()}
                                                    </span>
                                                    <span className="text-xl font-bold text-orange-600">
                                                        / {product.unit}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg text-gray-500 line-through">
                                                        ฿{product.sale_price.toLocaleString()}
                                                    </span>
                                                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                                        ลด {product.discount_percent}%
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-orange-600">
                                                    ฿{product.final_price.toLocaleString()}
                                                </span>
                                                <span className="text-xl font-bold text-orange-600">
                                                    / {product.unit}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quantity Controls and Add to Cart - Always available */}
                                <div className="space-y-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-gray-600">จำนวน:</span>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleQuantityChange(false)}
                                                disabled={quantity <= 1}
                                                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantityInput}
                                                onChange={(e) => handleQuantityInput(e.target.value)}
                                                onBlur={handleQuantityBlur}
                                                className="w-20 text-xl font-bold text-gray-900 text-center border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none py-1 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                            />
                                            <button
                                                onClick={() => handleQuantityChange(true)}
                                                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Total Price */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-gray-600">ราคารวม:</span>
                                        <span className="text-2xl font-bold text-orange-600">
                                            ฿{totalPrice.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAddingToCart || product.final_price === 0}
                                        className={`w-full py-4 px-6 rounded-xl font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 ${product.final_price === 0
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        {isAddingToCart ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>กำลังเพิ่ม...</span>
                                            </>
                                        ) : product.final_price === 0 ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                </svg>
                                                <span>ไม่สามารถเพิ่มได้ (ไม่มีราคา)</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5-5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                                                </svg>
                                                <span>เพิ่มลงในตระกร้า</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Zero Price Warning */}
                                {product.final_price === 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                        <div className="flex items-center justify-center space-x-2 text-red-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <span className="font-medium">สินค้าไม่มีราคา - ไม่สามารถเพิ่มลงในตระกร้าได้</span>
                                        </div>
                                    </div>
                                )}

                                {/* Stock Status Message (for information only) */}
                                {product.qty_available <= 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                        <div className="flex items-center justify-center space-x-2 text-yellow-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <span className="font-medium">สินค้าไม่มีในคลัง - สามารถสั่งซื้อล่วงหน้าได้</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
