import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../stores";

interface FilterState {
  filter: {
    start_date: Date;
    end_date: Date;
  };
}

const initialState: FilterState = {
  filter: {
    start_date: new Date(),
    end_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  },
};

const filterSlice = createSlice({
  name: "filter",
  initialState: initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

// actions
export const filterActions = filterSlice.actions;

// selectors
export const selectFilter = (state: RootState) => state.filter.filter;

// reducer
export default filterSlice.reducer;
