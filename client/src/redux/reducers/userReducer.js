// userReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutStart: (state) => {
      state.loading = true;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    signOutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} = userReducer.actions;

export default userReducer.reducer;
