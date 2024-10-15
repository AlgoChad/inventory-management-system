import { useRef } from "react";

type CacheData<T> = {
    data: T;
    timestamp: number;
};

const useCache = <T>(expirationTime: number = 60000) => {
    const cache = useRef(new Map<string, CacheData<T>>());
    const cacheKeys: string[] = [];

    const isExpired = (timestamp: number): boolean => {
        return (Date.now() - timestamp) > expirationTime;
    };

    const getCache = (key: string): T | undefined => {
        const cachedData = cache.current.get(key);
        if (cachedData) {
            if (isExpired(cachedData.timestamp)) {
                cache.current.delete(key);
                return undefined;
            }
            return cachedData.data;
        }
        return undefined;
    };

    const setCache = (key: string, data: T) => {
        cacheKeys.push(key);
        cache.current.set(key, { data, timestamp: Date.now() });
    };

    const clearCache = (key?: string) => {
        if (key) {
            cache.current.delete(key);
        } else {
            cache.current.clear();
        }
    };

    return { getCache, setCache, clearCache, cacheKeys };
};

export default useCache;