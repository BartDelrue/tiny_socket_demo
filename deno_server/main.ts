const clients = new Set<WebSocket>();

const generateId = () => crypto.randomUUID();
const broadcast = (sender, message) => clients.forEach(client => {
  client.send(JSON.stringify(message))
})

function handler(req: Request): Response {
  if (req.headers.get("upgrade") === "websocket") {

    const { socket, response } = Deno.upgradeWebSocket(req);
    const clientId = generateId();

    socket.onopen = () => clients.add(socket);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data.toString());

      if (message.type === "MOVE") {
        broadcast(socket, {
          type: "MOVE",
          id: clientId,
          data: { x: message.data.x, y: message.data.y }
        })
      }
    };

    socket.onclose = () => {
      console.log(`Client ${clientId} disconnected.`);
      clients.delete(socket);
      broadcast(socket, {type: "DISCONNECT", id: clientId, data: {}})
    };

    return response;
  }

  return new Response("This is a WebSocket server.", { status: 200 });
}

Deno.serve({ port: 8000 }, handler);