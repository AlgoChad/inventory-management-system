import { useRef, useEffect, useState } from 'react';
import WebSocketResolver from '../resolvers/WebSocketResolver';

export const useWebSocketResolver = () => {
    const resolverRef = useRef<WebSocketResolver | null>(null);
    const [resolver, setResolver] = useState<WebSocketResolver | null>(null);

    useEffect(() => {
        if (!resolverRef.current) {
            resolverRef.current = new WebSocketResolver('ws://192.168.254.104:8080');
            setResolver(resolverRef.current);
        }
    }, []);

    return resolver;
};