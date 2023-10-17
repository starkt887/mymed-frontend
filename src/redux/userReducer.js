import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    isLoggedIn: false,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    UPDATE_USER: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { UPDATE_USER } = userSlice.actions;

export default userSlice.reducer;
