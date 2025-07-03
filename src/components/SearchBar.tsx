import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    placeholder?: string;
    loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    onSearch,
    placeholder = "ค้นหาสินค้า... (เช่น โตโยต้า เบรค, toyota brake, รหัสสินค้า)",
    loading = false
}) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    }; return (
        <div className="relative w-full max-w-4xl mx-auto px-3 sm:px-0">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg
                        className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="w-full pl-10 sm:pl-12 pr-20 sm:pr-24 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-xl sm:rounded-2xl 
                             bg-white text-gray-900
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             placeholder-gray-500
                             shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                />

                <div className="absolute inset-y-0 right-0 pr-1 sm:pr-2 flex items-center">
                    <button
                        onClick={onSearch}
                        disabled={loading || !value.trim()}
                        className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg sm:rounded-xl hover:bg-indigo-700 
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all duration-300 transform hover:scale-105
                                   disabled:transform-none font-medium text-sm sm:text-base"
                    >
                        {loading ? (
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span className="hidden sm:inline">กำลังค้นหา...</span>
                            </div>
                        ) : (
                            'ค้นหา'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
