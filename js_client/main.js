const area = document.querySelector('#area')
const ws = new WebSocket('ws://localhost:8080');

const mice = new Map()
const createMouse = () => {
    const mouse = document.createElement('span')
    mouse.style.borderRadius = "50%"
    mouse.style.backgroundColor = `oklch(.7 2.6 ${Math.random() * 365})`
    mouse.style.aspectRatio = "1"
    mouse.style.width = ".5em"
    mouse.style.display = "inline-block"
    mouse.style.position = "absolute"
    return mouse
}
const handleMessage = (e) => {
    const message = JSON.parse(e.data)
    let mouse = mice.get(message.id)

    if (!mouse) {
        mouse = createMouse()
        area.appendChild(mouse)
        mice.set(message.id, mouse)
    }

    if (message.type === "MOVE") {
        mouse.style.left = message.data.x + "px"
        mouse.style.top = message.data.y + "px"
        return
    }
    if (message.type === "DISCONNECT" && mouse) {
        mouse.remove()
        mice.delete(message.id)
        return
    }

}
const sendMouseCoords = (e) => ws.send(JSON.stringify({
        type: "MOVE", data: {
            x: e.clientX,
            y: e.clientY
        }
    }
))
const cleanup = () => {
    area.removeEventListener('mousemove', sendMouseCoords)
}
const initSocket = function (e ) {
    area.addEventListener('mousemove', sendMouseCoords)
}

ws.addEventListener('message', handleMessage)
ws.addEventListener('open', initSocket)
ws.addEventListener('close', cleanup)

// To manually close the connection later:
// ws.close();