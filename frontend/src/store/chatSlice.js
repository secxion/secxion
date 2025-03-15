import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminId: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAdminId: (state, action) => {
      state.adminId = action.payload;
    },
    setMessages: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.messages = action.payload;
      } else {
        state.messages.push(action.payload);
      }
    },
  },
});

export const { setAdminId, setMessages } = chatSlice.actions;
export default chatSlice.reducer;