// socketReducer.ts
import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
  SOCKET_RECEIVE_MESSAGE,
} from "../actions/socketActionTypes";

interface SocketState {
  connected: boolean;
  messages: any[];
}

const initialState: SocketState = {
  connected: false,
  messages: [],
};

const socketReducer = (state = initialState, action: any): SocketState => {
  switch (action.type) {
    case SOCKET_CONNECTED:
      return { ...state, connected: true };
    case SOCKET_DISCONNECTED:
      return { ...state, connected: false };
    case SOCKET_RECEIVE_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};
// selector
export const selectConnected = (state: { socket: SocketState }) =>
  state.socket.connected;
export const selectMessages = (state: { socket: SocketState }) =>
  state.socket.messages;

export default socketReducer;
