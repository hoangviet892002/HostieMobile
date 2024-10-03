// store of redux with toolkit

import { createStore, applyMiddleware } from "redux";
import languageSlice from "../slices/languageSlice";
import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  language: languageSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
