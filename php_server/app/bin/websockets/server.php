<?php

// Caution! Ratchet is not maintained anymore!
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

require __DIR__ . '/../../vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Ramsey\Uuid\Uuid;

class GameServer implements MessageComponentInterface
{
    protected \SplObjectStorage $clients;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Assign UUID (like ws.id = v4())
        $conn->id = Uuid::uuid4()->toString();

        $this->clients->attach($conn);

        echo "New connection ({$conn->id})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $message = json_decode($msg, true);

        if (!$message) {
            return;
        }

        if ($message['type'] === 'MOVE') {
            $this->broadcast([
                'type' => 'MOVE',
                'id'   => $from->id,
                'data' => $message['data'],
            ]);
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);

        $this->broadcast([
            'type' => 'DISCONNECT',
            'id'   => $conn->id,
            'data' => new \stdClass(),
        ]);

        echo "Closed ({$conn->id}), {$this->clients->count()} connections remaining\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }

    protected function broadcast(array $message)
    {
        $encoded = json_encode($message);

        foreach ($this->clients as $client) {
            $client->send($encoded);
        }
    }
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new GameServer()
        )
    ),
    80 // poort
);

$server->run();
