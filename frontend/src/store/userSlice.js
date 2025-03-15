import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null, 
  loading: false,
  isLoggedIn: !!localStorage.getItem("token"), // Track logged-in state
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
      state.isLoggedIn = !!action.payload; // Update logged-in state
    },
    setUserDetails: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); 
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false; // Update logged-in state
      localStorage.removeItem("token");
      localStorage.removeItem("user"); 
    },
    setIsLoggedIn: (state, action) => { // New action to set logged-in state
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setToken, setUserDetails, setLoading, logout, setIsLoggedIn } = userSlice.actions;
export default userSlice.reducer;