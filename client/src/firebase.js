// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvSLlRoZxKAAuocSBC4TK0Q124fLaxo1U",
  authDomain: "sobo-thane.firebaseapp.com",
  projectId: "sobo-thane",
  storageBucket: "sobo-thane.appspot.com", // ✅ Fixed: should be .app**spot**.com
  messagingSenderId: "361748794872",
  appId: "1:361748794872:web:365cf4bd5b6ca6e7671a0d",
  measurementId: "G-2MECBB71FC"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // Optional: if you're using Google Sign-In

export { app, auth, provider };
