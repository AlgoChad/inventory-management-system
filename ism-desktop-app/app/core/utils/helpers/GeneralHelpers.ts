
export const TruncateTodoTitle = (title: string) => {
    return title.length > 30? title.substring(0, 30) + '...' : title;
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));