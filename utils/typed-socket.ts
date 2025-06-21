import { socket as rawSocket } from "@/utils/socket";
import type { SocketEventMap } from "@/types/socket-events";

type CustomEvent = keyof SocketEventMap;

export const typedSocket = {
  on<K extends CustomEvent>(event: K, listener: (data: SocketEventMap[K]) => void) {
    rawSocket.on(event as string, listener as (...args: any[]) => void);
  },
  off<K extends CustomEvent>(event: K, listener: (data: SocketEventMap[K]) => void) {
    rawSocket.off(event as string, listener as (...args: any[]) => void);
  },
  emit<K extends CustomEvent>(event: K, data: SocketEventMap[K]) {
    rawSocket.emit(event as string, data);
  },
};
