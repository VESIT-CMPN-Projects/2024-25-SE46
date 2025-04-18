// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvSLlRoZxKAAuocSBC4TK0Q124fLaxo1U",
  authDomain: "sobo-thane.firebaseapp.com",
  projectId: "sobo-thane",
  storageBucket: "sobo-thane.firebasestorage.app",
  messagingSenderId: "361748794872",
  appId: "1:361748794872:web:365cf4bd5b6ca6e7671a0d",
  measurementId: "G-2MECBB71FC"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth=getAuth(app)
export {app,auth}