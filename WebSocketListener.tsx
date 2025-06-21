"use client";

import { useEffect, useRef } from "react";
import { typedSocket } from "@/utils/typed-socket";
import type { SocketEventMap } from "@/types/socket-events";

type ListenerConfig = {
  [K in keyof SocketEventMap]?: (payload: SocketEventMap[K]) => void;
};

type WebSocketListenerProps = {
  listeners: ListenerConfig;
};

export function WebSocketListener({ listeners }: WebSocketListenerProps) {
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;

    const entries = Object.entries(listeners) as [keyof SocketEventMap, (payload: any) => void][];

    for (const [event, handler] of entries) {
      typedSocket.on(event, handler);
    }

    return () => {
      for (const [event, handler] of entries) {
        typedSocket.off(event, handler);
      }
    };
  }, [listeners]);

  return null;
}
