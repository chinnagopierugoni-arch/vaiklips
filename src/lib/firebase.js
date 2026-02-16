
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyAf90mBKGkMfe9J6EOpUvDummRheDm3EVo",
 authDomain: "autoshorts-c5df3.firebaseapp.com",
 projectId: "autoshorts-c5df3",
 storageBucket: "autoshorts-c5df3.firebasestorage.app",
 messagingSenderId: "1007615075964",
 appId: "1:1007615075964:web:0ff37c6dec625351998bf9",
 measurementId: "G-1VXNM9M6D8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== "undefined") {
 isSupported().then((isSupported) => {
  if (isSupported) {
   analytics = getAnalytics(app);
  }
 });
}

export { app, auth, db, googleProvider, analytics };
