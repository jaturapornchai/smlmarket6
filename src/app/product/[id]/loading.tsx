import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    {/* Back Button Skeleton */}
                    <div className="mb-6">
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </div>

                    {/* Product Details Skeleton */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                            {/* Product Image Skeleton */}
                            <div className="aspect-square bg-gray-200 rounded-lg"></div>

                            {/* Product Info Skeleton */}
                            <div className="flex flex-col justify-between">
                                <div>
                                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                                            <div className="h-6 bg-gray-200 rounded w-40"></div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Section Skeleton */}
                                <div className="border-t pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                                        <div className="text-right">
                                            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading Spinner */}
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <LoadingSpinner />
                        <p className="mt-4 text-gray-600 text-center">กำลังโหลดข้อมูลสินค้า...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
