import type {WebSocketHandler} from "./webSocketClient.ts";
import type {WebSocketMessage} from "./types";

export class RemoteCursorManager implements WebSocketHandler<WebSocketMessage> {

    private readonly mice = new Map()

    constructor(private readonly area: HTMLElement) {

    }

    createMouse() {
        const mouse = document.createElement('span')
        mouse.style.borderRadius = "50%"
        mouse.style.backgroundColor = `oklch(.7 2.6 ${Math.random() * 365})`
        mouse.style.aspectRatio = "1"
        mouse.style.width = ".5em"
        mouse.style.display = "inline-block"
        mouse.style.position = "absolute"
        return mouse
    }

    onMessage(message: WebSocketMessage) {
        let mouse = this.mice.get(message.id)

        if (!mouse) {
            mouse = this.createMouse()
            this.area.appendChild(mouse)
            this.mice.set(message.id, mouse)
        }

        if (message.type === "MOVE") {
            mouse.style.left = message.data.x + "px"
            mouse.style.top = message.data.y + "px"
            return
        }
        if (message.type === "DISCONNECT" && mouse) {
            mouse.remove()
            this.mice.delete(message.id)
            return
        }
    }

    onError(event: Event) {
        console.error(event)
    }

    onOpen(): void {
        console.log('ws open')
    }

    onClose(): void {
        console.log('ws closed')
    }
}
