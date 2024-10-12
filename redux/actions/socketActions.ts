import {
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
  SOCKET_EMIT_EVENT,
} from "./socketActionTypes";

export const connectSocket = () => ({ type: SOCKET_CONNECT });
export const disconnectSocket = () => ({ type: SOCKET_DISCONNECT });
export const emitSocketEvent = (eventName: string, payload: any) => ({
  type: SOCKET_EMIT_EVENT,
  eventName,
  payload,
});
