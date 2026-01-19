// src/firebase.js
import {
    initializeApp
} from "firebase/app";
import {
    getAuth
} from "firebase/auth";
import {
    getFirestore
} from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzna9xeOYKCbPdfj-qlMydMVdlHJbRurE",
    authDomain: "dern-support-system-portal.firebaseapp.com",
    projectId: "dern-support-system-portal",
    storageBucket: "dern-support-system-portal.firebasestorage.app",
    messagingSenderId: "845989931112",
    appId: "1:845989931112:web:8e6220aafe707bd036b3dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Firestore exports
export const auth = getAuth(app);
export const db = getFirestore(app);