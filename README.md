# WebSocket Cursor Follower Demo

This repository contains the code for the **Full Stack Introduction**
class workshop on WebSockets. It demonstrates how to establish a
bi-directional, real-time connection between a client (browser) and
multiple server environments to achieve a simple, real-time
cursor-following effect.

## Workshop Goals

This project serves as the practical component for the workshop
available at:
[https://ikdoeict.gitlab.io/public/vakken/full-stack-introductory-project/workshop-websocket/](https://ikdoeict.gitlab.io/public/vakken/full-stack-introductory-project/workshop-websocket/)

1. **Understand WebSockets:** Learn the fundamental handshake and
   message flow of the WebSocket protocol.
2. **Server Diversity:** Demonstrate WebSocket handling across
   multiple back-end technologies (Node.js, Deno, PHP).
3. **Architectural Refactoring:** Compare a simple, functional
   JavaScript approach (`js_client`) against a modern, modular, and
   type-safe TypeScript architecture (`ts_client`).

---

## 📂 Project Structure

The project is divided into the following key directories:

| Directory     | Purpose               | Description                                                                                                                  |
|:--------------|:----------------------|:-----------------------------------------------------------------------------------------------------------------------------|
| `js_client`   | **Base Client**       | Contains the original, simple **functional JavaScript** script (`main.js`)—the starting point for refactoring.               |
| `ts_client`   | **Refactored Client** | Contains the final, **modular TypeScript** client (`main.ts`, `webSocketClient.ts`), demonstrating architectural separation. |
| `node_server` | **Node.js Server**    | A WebSocket server implementation using Node.js and **pnpm** for package management.                                         |
| `php_server`  | **PHP Server**        | A WebSocket server implementation running on PHP (**Docker Compose available**).                                             |
| `deno_server` | **Deno Server**       | A WebSocket server implementation using the modern Deno runtime (**Docker Compose available**).                              |

---

## Prerequisites

You will need one ore more of the following:

* **Docker** and **Docker Compose** (Recommended for Deno/PHP).
* **Node.js** and **pnpm** (For Node.js manual setup).
* **Deno** (For Deno manual setup).