import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../stores";
import { use } from "i18next";
import { MessageType } from "@/types/MessageType";

interface MessageState {
  messages: MessageType[];
  user: {
    id: number;
    username: string;
    avatar: string;
  }[];
}
const initialState: MessageState = {
  messages: [],
  user: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    loadUser: (state, action) => {
      state.user = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = action.payload;
    },
    // load old messages
    loadMessages: (state, action) => {
      // action.payload is an array of messages
      // we need to add these messages to the beginning of the messages array
      state.messages = [...state.messages, ...action.payload];
    },

    receiveMessage: (state, action) => {
      state.messages = [...action.payload, ...state.messages];
    },
  },
});

export const messageActions = messageSlice.actions;

export const selectMessage = (state: RootState) => state.message.messages;
export const selectUser = (state: RootState) => state.message.user;

export default messageSlice.reducer;
