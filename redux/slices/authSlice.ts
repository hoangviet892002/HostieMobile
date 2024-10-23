// slice of state auth
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../stores";
import { use } from "i18next";

const initialState = {
  isAuthenticated: false,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, payload) => {
      state.userId = payload.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

// selectors
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectUserId = (state: RootState) => state.auth.userId;

// actions
export const authActions = authSlice.actions;

// reducer
export default authSlice.reducer;
