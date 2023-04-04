// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNsfFY5m-eOtTOj-BsZMRyZYM-TRHd1eM",
  authDomain: "reactnativemyfirst.firebaseapp.com",
  databaseURL:
    "https://reactnativemyfirst-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "reactnativemyfirst",
  storageBucket: "reactnativemyfirst.appspot.com",
  messagingSenderId: "629102931119",
  appId: "1:629102931119:web:65f25a5c2270476442785a",
  measurementId: "G-T4T4HHK0GN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;

export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
