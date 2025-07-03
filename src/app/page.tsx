'use client';

import { LoadingSpinner, ProductCard, SearchBar } from '@/components';
import { Product, searchProducts } from '@/lib/api';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastQuery, setLastQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const itemsPerPage = 20;

  // Save page state to sessionStorage
  const savePageState = useCallback(() => {
    const pageState = {
      searchQuery,
      products,
      currentPage,
      lastQuery,
      hasMore,
      totalCount,
      scrollY: window.scrollY
    };
    sessionStorage.setItem('homePageState', JSON.stringify(pageState));
  }, [searchQuery, products, currentPage, lastQuery, hasMore, totalCount]);

  // Load page state from sessionStorage
  const loadPageState = useCallback(() => {
    const savedState = sessionStorage.getItem('homePageState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setSearchQuery(state.searchQuery || '');
        setProducts(state.products || []);
        setCurrentPage(state.currentPage || 1);
        setLastQuery(state.lastQuery || '');
        setHasMore(state.hasMore !== false);
        setTotalCount(state.totalCount || 0);
        
        // Restore scroll position after a short delay
        if (state.scrollY) {
          setTimeout(() => {
            window.scrollTo(0, state.scrollY);
          }, 100);
        }
      } catch (error) {
        console.error('Error loading page state:', error);
      }
    } else {
      // Check if we have a saved scroll position from product navigation
      const scrollState = sessionStorage.getItem('homeScrollPosition');
      if (scrollState) {
        try {
          const { scrollY, timestamp } = JSON.parse(scrollState);
          // Only restore if it's recent (within 5 minutes)
          if (Date.now() - timestamp < 300000) {
            setTimeout(() => {
              window.scrollTo(0, scrollY);
            }, 100);
          }
          // Clean up the scroll position after use
          sessionStorage.removeItem('homeScrollPosition');
        } catch (error) {
          console.error('Error restoring scroll position:', error);
        }
      }
    }
  }, []);

  // Load page state on component mount
  useEffect(() => {
    loadPageState();
  }, [loadPageState]);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Ensure backward compatibility - convert objects to strings if needed
        const stringHistory = parsedHistory.map((item: unknown) =>
          typeof item === 'string' ? item : (item as { query?: string }).query || String(item)
        );
        setSearchHistory(stringHistory);
      } catch {
        console.error('Error parsing search history');
        setSearchHistory([]);
      }
    }
  }, []);

  // Save search to history
  const addToHistory = (query: string) => {
    if (!query.trim()) return;

    setSearchHistory(prev => {
      // Ensure all items are strings
      const cleanHistory = prev.filter(item => typeof item === 'string');
      const newHistory = [query, ...cleanHistory.filter(item => item !== query)].slice(0, 10); // Keep only last 10 searches
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Clear any corrupted history on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // Check if any item is not a string
        const hasObjects = parsedHistory.some((item: unknown) => typeof item !== 'string');
        if (hasObjects) {
          // Clear corrupted history
          localStorage.removeItem('searchHistory');
          setSearchHistory([]);
        }
      }
    } catch {
      // Clear corrupted history
      localStorage.removeItem('searchHistory');
      setSearchHistory([]);
    }
  }, []);

  const handleSearch = useCallback(async (query?: string, page: number = 1, loadMore: boolean = false) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
      setProducts([]);
      setCurrentPage(1);
      setHasMore(true);
    }

    try {
      const offset = (page - 1) * itemsPerPage;
      const result = await searchProducts(searchTerm, itemsPerPage, offset);

      if (result.success) {
        const newProducts = result.data.data;

        if (loadMore) {
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }

        setTotalCount(result.data.total_count);
        setLastQuery(searchTerm);
        setCurrentPage(page);

        // Add to search history only for new searches (not load more)
        if (!loadMore) {
          addToHistory(searchTerm);
        }

        // Check if there are more products to load
        const totalLoaded = (page - 1) * itemsPerPage + newProducts.length;
        setHasMore(totalLoaded < result.data.total_count);
      } else {
        setError('เกิดข้อผิดพลาดในการค้นหา');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต หรือลองใหม่อีกครั้ง');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, itemsPerPage]);

  const loadMoreProducts = useCallback(() => {
    if (hasMore && !loadingMore && lastQuery) {
      handleSearch(lastQuery, currentPage + 1, true);
    }
  }, [hasMore, loadingMore, lastQuery, currentPage, handleSearch]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && lastQuery) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, lastQuery, loadMoreProducts]);

  // Save state when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      savePageState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [savePageState]);

  // Save state when navigating away or when data changes
  useEffect(() => {
    // Save state when products or search changes
    const timeoutId = setTimeout(() => {
      if (products.length > 0 || searchQuery) {
        savePageState();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [products, searchQuery, savePageState]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  SML Market
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  ระบบค้นหาสินค้าอัจฉริยะ
                </p>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              API: smlgoapi.dedepos.com
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-8">
        {/* Search Section */}
        <div className="mb-4 sm:mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={() => handleSearch()}
            loading={loading}
          />

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-3 max-w-4xl mx-auto px-3 sm:px-0">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0114 0z" />
                  </svg>
                  <span>ประวัติการค้นหา ({searchHistory.length})</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showHistory && (
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-600 hover:text-red-700 transition-colors"
                  >
                    ลบทั้งหมด
                  </button>
                )}
              </div>

              {showHistory && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3">
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((historyItem, index) => {
                      // Ensure historyItem is a string
                      const searchTerm = typeof historyItem === 'string' ? historyItem : (historyItem as { query?: string }).query || 'Unknown';

                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 
                                   rounded-full hover:bg-gray-100 transition-colors group"
                        >
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span
                            onClick={() => {
                              setSearchQuery(searchTerm);
                              handleSearch(searchTerm);
                              setShowHistory(false);
                            }}
                            className="cursor-pointer flex-1"
                          >
                            {searchTerm}
                          </span>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchHistory(prev => {
                                const newHistory = prev.filter((_, i) => i !== index);
                                localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                                return newHistory;
                              });
                            }}
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <svg className="w-3 h-3 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <LoadingSpinner
            size="lg"
            text="กำลังค้นหาสินค้าด้วย AI..."
          />
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto mb-4 sm:mb-8 px-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                เกิดข้อผิดพลาด
              </h3>
              <p className="text-red-600 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && products.length === 0 && lastQuery && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่พบสินค้าที่ค้นหา
            </h3>
            <p className="text-gray-600 mb-4">
              ลองใช้คำค้นหาอื่น เช่น ชื่อแบรนด์ หรือประเภทสินค้า
            </p>
            <div className="text-sm text-gray-500">
              คำค้นหา: &quot;{lastQuery}&quot;
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Indicator */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex flex-col items-center justify-center mt-8 space-y-4">
                {loadingMore ? (
                  <LoadingSpinner
                    size="md"
                    text="กำลังโหลดสินค้าเพิ่มเติม..."
                  />
                ) : (
                  <>
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-500 mb-3">
                        เลื่อนลงเพื่อดูสินค้าเพิ่มเติม
                      </div>
                      <button
                        onClick={loadMoreProducts}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 
                                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                 transition-all duration-300 transform hover:scale-105
                                 font-medium text-sm sm:text-base"
                      >
                        โหลดสินค้าเพิ่มเติม
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* End of Results */}
            {!hasMore && products.length > 0 && (
              <div className="text-center mt-8 py-4">
                <div className="text-sm text-gray-500">
                  แสดงครบทั้งหมด {totalCount} รายการแล้ว
                </div>
              </div>
            )}
          </>
        )}        {/* Welcome Message */}
        {!loading && !error && products.length === 0 && !lastQuery && (
          <div className="text-center py-6 sm:py-12 px-3">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-8">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              ยินดีต้อนรับสู่ SML Market
            </h3>
            <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto mb-6 sm:mb-8">
              ค้นหาสินค้าด้วยเทคโนโลยี AI ที่รองรับภาษาไทยและอังกฤษ
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  ค้นหาอัจฉริยะ
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  รองรับการค้นหาแบบ semantic search ด้วย AI
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  รองรับบาร์โค้ด
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  ค้นหาด้วยบาร์โค้ดและรหัสสินค้า
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                  หลายภาษา
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  รองรับภาษาไทยและอังกฤษ
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
