export async function benchmark<T>(
    fn: (...args: any[]) => T | Promise<T>,
    ...args: any[]
): Promise<T> {
    const functionName = fn.name || "anonymous function";
    console.log(`Benchmarking ${functionName} with arguments:`, args);

    const startMemory = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    const result = await fn(...args);

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    console.log(
        `Execution time: ${(endTime - startTime).toFixed(2)} milliseconds`
    );
    console.log(`Memory usage: ${(endMemory - startMemory) / 1024} KB`);

    return result;
}
