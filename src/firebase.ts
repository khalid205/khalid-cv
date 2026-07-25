// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApIO1DY3lVc0VjriETx0NJ0013W3eXLUQ",
  authDomain: "khalid-cv-6a626.firebaseapp.com",
  projectId: "khalid-cv-6a626",
  storageBucket: "khalid-cv-6a626.firebasestorage.app",
  messagingSenderId: "634953782602",
  appId: "1:634953782602:web:5abe8f3c98d3e8dfa01db3",
  measurementId: "G-3NMYBJG6XF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);
export { analytics };