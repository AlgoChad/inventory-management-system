export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const TruncateTodoTitle = (title: string) => {
    return title.length > 30 ? title.substring(0, 30) + '...' : title;
}

export const FormatShortDate = (data: any) => {
    const date = new Date(data);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export const FormatShortTime = (data: any) => {
    const date = new Date(data);
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString('en-US', options);
}
