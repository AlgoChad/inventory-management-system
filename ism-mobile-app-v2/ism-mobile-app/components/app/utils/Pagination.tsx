import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
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
        const maxPagesToShow = 1;
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
                <TouchableOpacity
                    key={i}
                    style={[
                        styles.pageButton,
                        currentPage === i ? styles.activePageButton : styles.inactivePageButton
                    ]}
                    onPress={() => handlePageClick(i)}
                >
                    <Text style={currentPage === i ? styles.activePageText : styles.inactivePageText}>
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }

        return pageNumbers;
    };

    return (
        <View style={styles.container}>
            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                    onPress={handlePrevious}
                    disabled={currentPage === 1}
                >
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                {renderPageNumbers()}
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                    onPress={handleNext}
                    disabled={currentPage === totalPages}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 8,
    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    pageButton: {
        padding: 2,
        marginHorizontal: 2,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: '#f0f0f0',
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 24,
        height: 24,
    },
    disabledButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#ccc',
    },
    buttonText: {
        color: '#333',
        fontSize: 12,
    },
    activePageButton: {
        backgroundColor: 'white',
        borderColor: 'gray',
    },
    inactivePageButton: {
        backgroundColor: 'white',
        borderColor: '#ccc',
    },
    activePageText: {
        color: 'gray',
        fontSize: 12,
    },
    inactivePageText: {
        color: '#333',
        fontSize: 12,
    },
    pageInfo: {
        marginLeft: 4,
        fontSize: 12,
        color: '#333',
    },
});
