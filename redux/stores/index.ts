// store of redux with toolkit

import languageSlice from "../slices/languageSlice";

import authSlice from "../slices/authSlice";

import messageSlice from "../slices/messageSlice";

import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  language: languageSlice,
  auth: authSlice,
  message: messageSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
