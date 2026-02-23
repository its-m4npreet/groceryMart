import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

/**
 * A responsive pagination component that handles large page numbers gracefully.
 * 
 * @param {number} currentPage - The current active page
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback function when a page is changed
 * @param {boolean} isLoading - Loading state
 */
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading = false }) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Maximum numbered buttons to show

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Logic for ellipses
            if (currentPage <= 3) {
                // Near start: 1 2 3 4 ... 10
                pages.push(1, 2, 3, 4, 'ellipsis-end', totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Near end: 1 ... 7 8 9 10
                pages.push(1, 'ellipsis-start', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                // Middle: 1 ... 4 5 6 ... 10
                pages.push(1, 'ellipsis-start', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-end', totalPages);
            }
        }

        return pages.map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                    <span
                        key={`${page}-${index}`}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-400"
                    >
                        <MoreHorizontal size={16} />
                    </span>
                );
            }

            const isActive = currentPage === page;

            return (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={isLoading}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-sm md:text-base font-medium transition-all ${isActive
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-200 ring-2 ring-primary-100'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            {/* Mobile Page Indicator */}
            <div className="sm:hidden text-sm text-gray-500 font-medium">
                Page <span className="text-gray-900">{currentPage}</span> of <span className="text-gray-900">{totalPages}</span>
            </div>

            <nav className="flex items-center gap-1 md:gap-2" aria-label="Pagination">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className="flex items-center gap-1 px-2 py-2 md:px-4 md:py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                    aria-label="Previous Page"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden md:inline">Previous</span>
                </button>

                {/* Page Numbers (Hidden on very small mobile if too many) */}
                <div className="flex items-center gap-1 md:gap-2">
                    {renderPageNumbers()}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className="flex items-center gap-1 px-2 py-2 md:px-4 md:py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                    aria-label="Next Page"
                >
                    <span className="hidden md:inline">Next</span>
                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
