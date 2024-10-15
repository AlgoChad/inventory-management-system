

export const BuildIndex = <T>(data: T[], key: keyof T): { [key: string]: number[] } => {
    const newIndex: { [key: string]: number[] } = {};
    data.forEach((item, idx) => {
        const words = (item[key] as unknown as string).split(" ");
        words.forEach(word => {
            const lowerCaseWord = word.toLowerCase();
            if (!newIndex[lowerCaseWord]) {
                newIndex[lowerCaseWord] = [];
            }
            newIndex[lowerCaseWord].push(idx);
        });
    });
    return newIndex;
};

export const LevenshteinDistance = (a: string, b: string): number => {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1
                );
            }
        }
    }

    return matrix[a.length][b.length];
};

export const LevenshteinSearch = <T>(index: { [key: string]: number[] }, data: T[], key: keyof T, query: string, threshold: number = 2): T[] => {
    const results: T[] = [];
    const queryWords = query.toLowerCase().split(" ");

    queryWords.forEach(queryWord => {
        Object.keys(index).forEach(indexWord => {
            const distance = LevenshteinDistance(queryWord, indexWord);
            if (distance <= threshold) {
                index[indexWord].forEach(idx => {
                    if (!results.includes(data[idx])) {
                        results.push(data[idx]);
                    }
                });
            }
        });
    });

    return results;
};