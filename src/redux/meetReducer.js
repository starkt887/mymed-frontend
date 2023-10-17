import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channelName: null,
  video_token: null,
  chat_token: null,
  uid: null,
  appointmentId: null,
  appointmentData: null,
  userRole: null,
};

export const meetSlice = createSlice({
  name: "meet",
  initialState,
  reducers: {
    UPDATE_MEET: (state, action) => {
      const {
        channelName,
        video_token,
        chat_token,
        uid,
        appointmentId,
        appointmentData,
        userRole,
      } = action.payload;
      state.channelName = channelName;
      state.video_token = video_token;
      state.chat_token = chat_token;
      state.uid = uid;
      state.appointmentId = appointmentId;
      state.appointmentData = appointmentData;
      state.userRole = userRole;
    },
  },
});

export const { UPDATE_MEET } = meetSlice.actions;

export default meetSlice.reducer;
