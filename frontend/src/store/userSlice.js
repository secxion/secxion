import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  loading: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = !!action.payload; 
    },
    setUserDetails: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    },
    clearState: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
    },
  },
});

export const { setToken, setUserDetails, setLoading, logout, clearState } = userSlice.actions;
export default userSlice.reducer;
