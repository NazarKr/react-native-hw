import { auth } from "../../firebase/config";
import { authSlice } from "./authReducer";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const { updateUserProfile, authStateChange, authLogOut } = authSlice.actions;

export const authLoginUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const { uid, displayName } = user;
      dispatch(updateUserProfile({ userID: uid, login: displayName }));
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log("errorCode", errorCode);
      console.log("errorMessage", errorMessage);
    }
  };

export const authLogOutUser = () => async (dispatch, getState) => {
  try {
    await signOut(auth);
    dispatch(authLogOut());
  } catch (err) {
    const errorCode = err.code;
    const errorMessage = err.message;
    console.log("errorCode", errorCode);
    console.log("errorMessage", errorMessage);
  }
};

export const authSignUpUser =
  ({ email, password, login }) =>
  async (dispatch, getState) => {
    const state = getState();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      await updateProfile(user, {
        displayName: login,
      });
      const { uid, displayName } = user;

      console.log(uid, displayName);

      dispatch(
        updateUserProfile({
          userID: uid,
          login: displayName,
        })
      );
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log("errorCode", errorCode);
      console.log("errorMessage", errorMessage);
    }
  };

export const authStateChangeUser = () => async (dispatch, getState) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUpdateProfile = {
        userID: user.uid,
        login: user.displayName,
      };
      dispatch(updateUserProfile(userUpdateProfile));
      dispatch(authStateChange({ stateChange: true }));
    }
  });
};
