// store of redux with toolkit

import { createStore, applyMiddleware } from "redux";
import languageSlice from "../slices/languageSlice";
import socketSlice from "../slices/socketSlice";
import authSlice from "../slices/authSlice";
import { socketMiddleware } from "../middleware/socketMiddleware";
import thunk from "redux-thunk";
import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  language: languageSlice,
  socket: socketSlice,
  auth: authSlice,
});

const store = createStore(rootReducer, applyMiddleware(socketMiddleware));

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
