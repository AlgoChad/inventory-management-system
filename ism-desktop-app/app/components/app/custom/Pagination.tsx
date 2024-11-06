import React, { memo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
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
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={currentPage === i}
                        onClick={() => handlePageClick(i)}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (startPage > 1) {
            pageNumbers.unshift(
                <PaginationItem key="start-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        if (endPage < totalPages) {
            pageNumbers.push(
                <PaginationItem key="end-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        return pageNumbers;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={handlePrevious} />
                </PaginationItem>
                {renderPageNumbers()}
                <PaginationItem>
                    <PaginationNext onClick={handleNext} />
                </PaginationItem>
            </PaginationContent>
            <div className="flex justify-end items-center text-black mx-2 text-xs">
                Page {currentPage} of {totalPages}
            </div>
        </Pagination>
    );
};

export default memo(CustomPagination);
