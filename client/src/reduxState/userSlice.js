import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    signInOrUpdateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    deleteOrLogoutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
    },

    finishLoading: (state) => {
      state.loading = false;
    },
  },
});

export const {
  finishLoading,
  startLoading,
  signInOrUpdateSuccess,
  deleteOrLogoutUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
