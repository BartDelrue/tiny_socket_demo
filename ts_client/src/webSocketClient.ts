export interface WebSocketHandler<T> {
    onOpen(event: Event): void;

    onClose(event: CloseEvent): void;

    onError(event: Event): void;

    onMessage(message: T): void
}

export class WebSocketClient<TIn, TOut> {
    private socket: WebSocket | null = null;
    private readonly openListeners: Function[] = [];
    private readonly closeListeners: Function[] = [];

    constructor(
        private readonly url: string,
        private readonly handler: WebSocketHandler<TIn>) {
    }

    public onOpen(callback: (event: Event) => void) {
        this.openListeners.push(callback)
    }

    public onClose(callback: (event: Event) => void) {
        this.closeListeners.push(callback)
    }

    public connect(): void {
        if (this.socket?.readyState === WebSocket.OPEN) return

        // create the socket
        this.socket = new WebSocket(this.url)

        this.socket.onopen = this.handleOpen
        this.socket.onclose = this.handleClose
        this.socket.onerror = this.handleError
        this.socket.onmessage = this.handleMessage

    }

    public close(code?: number, reason?: string): void {
        if (this.socket?.readyState !== WebSocket.OPEN) return
        this.socket.close(code, reason)
    }

    public send(message: TOut): void {
        if (this.socket?.readyState !== WebSocket.OPEN) {
            console.error('cannot send message, WebSocket is not open or not initialized')
            return
        }

        try {
            const outString = JSON.stringify(message)
            this.socket.send(outString)
        } catch {
            console.error('unable to parse outgoing message')
        }
    }

    private handleOpen = (event: Event): void => {
        this.handler.onOpen(event)
        this.openListeners.forEach(c => c(event))
    }
    private handleClose = (event: CloseEvent): void => {
        this.handler.onClose(event)
        this.closeListeners.forEach(c => c(event))
    }
    private handleError = (event: Event): void => {
        this.handler.onError(event)
    }
    private handleMessage = (event: MessageEvent): void => {
        try {

            const raw: string = event.data
            const message: TIn = JSON.parse(raw)

            this.handler.onMessage(message)
        } catch {
            console.error('failed to parse incoming message')
        }
    }
}