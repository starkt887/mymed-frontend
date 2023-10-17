import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  notificationCount: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    STORE_NOTIFICATIONS: (state, action) => {
      state.notifications = action.payload;
    },
    UPDATE_NOTIFICATION_COUNT: (state, action) => {
      state.notificationCount = action.payload;
    },
  },
});

export const { STORE_NOTIFICATIONS, UPDATE_NOTIFICATION_COUNT } =
  notificationSlice.actions;

export default notificationSlice.reducer;
