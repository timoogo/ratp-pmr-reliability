// utils/socket.ts
import { io, Socket } from "socket.io-client";

export const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001", {
    transports: ["websocket"],
});
