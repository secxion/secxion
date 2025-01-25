import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: true, // Tracks whether the authentication check is in progress
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
      state.loading = false; // Authentication resolved
    },
    clearUserDetails: (state) => {
      state.user = null;
      state.loading = false; // Authentication resolved
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserDetails, clearUserDetails, setLoading } = userSlice.actions;

export default userSlice.reducer;
