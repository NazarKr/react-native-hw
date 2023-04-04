import { createSlice } from "@reduxjs/toolkit";

const state = {
  userID: null,
  login: null,
  stateChange: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => {
      console.log("updating user profile:", payload.userID, payload.login);
      return {
        ...state,
        userID: payload.userID,
        login: payload.login,
      };
    },
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authLogOut: () => state,
  },
});
