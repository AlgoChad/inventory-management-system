import WebSocket from 'isomorphic-ws';

type SubscriberCallback = (data: unknown) => void;

class WebSocketResolver {
    private Url: string;
    private Ws: WebSocket | null;
    private Subscribers: { [topic: string]: SubscriberCallback[] };

    constructor(url: string) {
        this.Url = url;
        this.Ws = null;
        this.Subscribers = {};

        this.Connect();
    }

    private Connect(): void {
        const newSocket = new WebSocket(this.Url);

        newSocket.onopen = () => {
            console.info('Connected to WebSocket server');
            Object.keys(this.Subscribers).forEach(topic => {
                newSocket.send(JSON.stringify({ action: 'subscribe', topic }));
            });
        };

        newSocket.onmessage = (event: WebSocket.MessageEvent) => {
            const message = JSON.parse(event.data as string);
            
            if (message.topic) {
                this.NotifySubscribers(message.topic, message.data);
            } else if (message.error) {
                console.error('Received error message:', message.error);
            } else {
                console.warn('Received message with invalid structure:', message);
            }
        };

        newSocket.onclose = () => {
            console.warn('Disconnected from WebSocket server');
        };

        newSocket.onerror = (error: WebSocket.ErrorEvent) => {
            console.error('WebSocket error:', error);
        };

        this.Ws = newSocket;
    }

    public IsConnected() {
        return this.Ws && this.Ws.readyState === WebSocket.OPEN;
    }

    public Subscribe(topic: string, callback: SubscriberCallback): void {
        if (!this.Subscribers[topic]) {
            this.Subscribers[topic] = [];
        }
        this.Subscribers[topic].push(callback);

        if (this.Ws && this.Ws.readyState === WebSocket.OPEN) {
            this.Ws.send(JSON.stringify({ action: 'subscribe', topic }));
        } else {
            console.warn("WebSocket is not open. Unable to subscribe to topic:", topic);
        }
    }

    public Unsubscribe(topic: string, callback: SubscriberCallback): void {
        if (!this.Subscribers[topic]) return;

        this.Subscribers[topic] = this.Subscribers[topic].filter(sub => sub !== callback);

        if (this.Subscribers[topic].length === 0) {
            delete this.Subscribers[topic];
        }

        if (this.Ws && this.Ws.readyState === WebSocket.OPEN) {
            this.Ws.send(JSON.stringify({ action: 'unsubscribe', topic }));
        } else {
            console.warn("WebSocket is not open. Unable to unsubscribe from topic:", topic);
        }
    }

    private NotifySubscribers(topic: string, data: unknown): void {
        if (!this.Subscribers[topic]) return;

        this.Subscribers[topic].forEach(callback => callback(data));
    }

    public Publish(topic: string, data: unknown): void {
        const message = JSON.stringify({ action: 'publish', topic, data });
        if (this.Ws && this.Ws.readyState === WebSocket.OPEN) {
            this.Ws.send(message);
            console.info("Published message:", message);
        } else {
            console.warn('WebSocket is not open. Unable to send message:', message);
        }
    }
}

export default WebSocketResolver;