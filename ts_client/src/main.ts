import {WebSocketClient} from "./webSocketClient.ts";
import type {WebSocketMessage, WebSocketOutgoingMoveMessage} from "./types";
import {RemoteCursorManager} from "./remoteCursorManager.ts";

const wsEndpoint = import.meta.env.VITE_WS_ENDPOINT
const area: HTMLElement | null = document.querySelector('#area')
if (!area) throw Error("Missing HTML element #area")

const handler = new RemoteCursorManager(area)
const webSocketClient = new WebSocketClient<WebSocketMessage, WebSocketOutgoingMoveMessage>(
    wsEndpoint,
    handler
)
const sendMouseCoords = (e: MouseEvent) => webSocketClient.send({
    type: "MOVE",
    data: {
        x: e.clientX,
        y: e.clientY
    }
})
webSocketClient.connect()
webSocketClient.onOpen(() => area.addEventListener('mousemove', sendMouseCoords))
webSocketClient.onClose(() => area.removeEventListener('mousemove', sendMouseCoords))
