import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

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

        if (startPage > 1) {
            pageNumbers.unshift(
                <Text key="start-ellipsis" style={styles.ellipsis}>
                    ...
                </Text>
            );
        }

        if (endPage < totalPages) {
            pageNumbers.push(
                <Text key="end-ellipsis" style={styles.ellipsis}>
                    ...
                </Text>
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
        padding: 4,
        marginHorizontal: 2,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: 'black',
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: 'gray',
        borderColor: 'gray',
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
    },
    activePageButton: {
        backgroundColor: 'black',
        borderColor: 'black',
    },
    inactivePageButton: {
        backgroundColor: 'white',
        borderColor: 'black',
    },
    activePageText: {
        color: 'white',
        fontSize: 12,
    },
    inactivePageText: {
        color: 'black',
        fontSize: 12,
    },
    ellipsis: {
        paddingHorizontal: 4,
        marginHorizontal: 2,
        fontSize: 12,
    },
    pageInfo: {
        marginLeft: 4,
        fontSize: 12,
    },
});