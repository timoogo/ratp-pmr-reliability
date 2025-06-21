"use client";


import { WebSocketListener } from "@/WebSocketListener";
import { getGlobalSocketListeners } from "@/config/websocket-listeners";
import { useShallowMemoObject } from "@/hooks/useShallowMemoObject";

export function WebSocketListenerClient() {
  const listeners = useShallowMemoObject(getGlobalSocketListeners());
  return <WebSocketListener listeners={listeners} />;
}