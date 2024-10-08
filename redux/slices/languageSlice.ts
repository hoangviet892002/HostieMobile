// slice of state laguage

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../stores";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLanguage: "vi",
    availableLanguages: ["en", "vi"],
  },
  reducers: {
    changeLanguage: (state) => {
      state.currentLanguage = state.currentLanguage === "en" ? "vi" : "en";
    },
  },
});

// export actions
export const languageActions = languageSlice.actions;

// export selectors
export const selectCurrentLanguage = (state: RootState) =>
  state.language.currentLanguage;
export const selectAvailableLanguages = (state: RootState) =>
  state.language.availableLanguages;
// export reducer
export default languageSlice.reducer;
