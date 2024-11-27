import { sleep } from "./HelperFunctions";

export const Retry = async <T>(
    func: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
): Promise<T> => {
    let attempts = 0;
    const Execute = async (): Promise<T> => {
        try {
            return await func();
        } catch (error) {
            if (attempts < retries) {
                attempts++;
                const backOffDelay = delay * Math.pow(2, attempts);
                await sleep(backOffDelay);
                return Execute();
            } else {
                throw error;
            }
        }
    }

    return Execute();
};