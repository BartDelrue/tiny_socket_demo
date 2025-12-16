export interface WebSocketOutgoingMoveMessage {
    type: 'MOVE'
    data: {
        x: number,
        y: number
    }
}
interface WebSocketMoveMessage extends WebSocketOutgoingMoveMessage{
    id?: string,
}
interface WebSocketDisconnectMessage {
    type: 'DISCONNECT',
    id: string
}
export type WebSocketMessage = WebSocketMoveMessage | WebSocketDisconnectMessage

