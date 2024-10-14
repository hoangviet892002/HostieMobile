// slice of state auth
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../stores";

const initialState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

// selectors
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

// actions
export const authActions = authSlice.actions;

// reducer
export default authSlice.reducer;
