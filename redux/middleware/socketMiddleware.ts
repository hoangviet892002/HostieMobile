// socketMiddleware.ts
import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../stores";
import {
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
  SOCKET_EMIT_EVENT,
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
  SOCKET_RECEIVE_MESSAGE,
} from "../actions/socketActionTypes";

let socket: Socket | null = null;

interface SocketMiddlewareAction {
  type: string;
  eventName?: string;
  payload?: any;
}

export const socketMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    switch (action.type) {
      case SOCKET_CONNECT:
        if (socket !== null) {
          socket.disconnect();
        }

        // Khởi tạo socket
        socket = io("jhkhk", {
          transports: ["websocket"],
        });

        // Xử lý khi kết nối thành công
        socket.on("connect", () => {
          console.log("Socket connected:", socket?.id);
          store.dispatch({ type: SOCKET_CONNECTED });
        });

        // Xử lý khi ngắt kết nối
        socket.on("disconnect", () => {
          console.log("Socket disconnected");
          store.dispatch({ type: SOCKET_DISCONNECTED });
        });

        // Lắng nghe các sự kiện từ server
        socket.on("message", (data: any) => {
          store.dispatch({ type: SOCKET_RECEIVE_MESSAGE, payload: data });
        });

        break;

      case SOCKET_EMIT_EVENT:
        if (socket) {
          socket.emit(action.eventName, action.payload);
        }
        break;

      case SOCKET_DISCONNECT:
        if (socket) {
          socket.disconnect();
        }
        socket = null;
        break;

      default:
        break;
    }

    return next(action);
  };
