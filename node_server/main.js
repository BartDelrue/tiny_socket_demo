import {WebSocketServer} from "ws";
import {v4} from "uuid";

const wss = new WebSocketServer({port: 8080})
const broadcast = (sender, message) => wss.clients.forEach(client => {
    // if (client === sender || client.readyState !== WebSocket.OPEN) {
    //     return
    // }
    client.send(JSON.stringify(message))
})

wss.on('connection', ws => {
    ws.id = v4()
    ws.on('error', console.error)
    ws.on('message', data => {
        const message = JSON.parse(data.toString())
        if (message.type === "MOVE") {
            broadcast(ws, {type: "MOVE", id: ws.id, data: message.data})
        }
    })
    ws.on('close', () => {
        broadcast({type: "DISCONNECT", id: ws.id, data: {}})
        console.log(`closed, ${wss.clients.size} connections remaining`)
    })
})

