// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBye11aDR77pENqM9P3dezlPH9uwhgCtCk",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sml-market.firebaseapp.com",
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://sml-market-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sml-market",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sml-market.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "311929894370",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:311929894370:web:339b4df8c5c1b1ec7635bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
export const database = getDatabase(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;
