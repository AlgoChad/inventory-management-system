
export const TruncateTodoTitle = (title: string) => {
    return title.length > 30? title.substring(0, 30) + '...' : title;
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
