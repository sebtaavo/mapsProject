import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Fetching from .env
  authDomain: "groupsfinder.firebaseapp.com",
  projectId: "groupsfinder",
  storageBucket: "groupsfinder.firebaseapp.com",
  messagingSenderId: "238885772895",
  appId: "1:238885772895:web:977a01128e4acf758905ea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;
const db = getFirestore(app); // Initialize Firestore
export { db };