// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBcfE7GxMX7LAt1OBLrSs18EoXyZy6VJc",
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