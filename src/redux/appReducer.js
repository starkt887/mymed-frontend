import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    SET_LOADING: (state, action) => {
      state.loading = action.payload;
    },
    __RESET__: () => initialState,
  },
});

export const { SET_LOADING, __RESET__ } = appSlice.actions;

export default appSlice.reducer;
