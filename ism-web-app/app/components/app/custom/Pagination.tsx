import React, { memo } from 'react';
import { Button, buttonVariants } from "~/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
        let endPage = Math.min(totalPages, currentPage + halfMaxPagesToShow);

        if (currentPage <= halfMaxPagesToShow) {
            endPage = Math.min(totalPages, maxPagesToShow);
        }

        if (currentPage + halfMaxPagesToShow >= totalPages) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <Button
                    key={i}
                    className={`${buttonVariants({ variant: 'outline' })} ${currentPage === i ? 'bg-black text-white' : 'bg-white text-black'}`}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </Button>
            );
        }

        if (startPage > 1) {
            pageNumbers.unshift(<span key="start-ellipsis" className="px-3 py-1 mx-1">...</span>);
        }

        if (endPage < totalPages) {
            pageNumbers.push(<span key="end-ellipsis" className="px-3 py-1 mx-1">...</span>);
        }

        return pageNumbers;
    };

    return (
        <div className="flex flex-col items-center mt-4">
            <div className="flex justify-center mb-2">
                <Button
                    className={`${buttonVariants({ variant: 'outline' })} bg-black text-white`}
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                {renderPageNumbers()}
                <Button
                    className={`${buttonVariants({ variant: 'outline' })} bg-black text-white`}
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
                <div className="flex justify-center items-center text-black mx-2">
                    Page {currentPage} of {totalPages}
                </div>
            </div>
        </div>
    );
};

export default memo(Pagination);