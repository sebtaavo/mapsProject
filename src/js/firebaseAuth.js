import { initializeApp } from "firebase/app";
import config from "./firebaseConfig.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

// Initialize Firebase app
const app = initializeApp(config);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Handle authentication state change
onAuthStateChanged(auth, (user) => {
    this.user = user;
    this.authButtonText = user ? 'Log out' : 'Log in'; // Update button text based on auth state
  
    if (user) {
      console.log('User ID:', user.uid); 
      console.log('User Name:', user.displayName);  // User's name
      console.log('User Email:', user.email);      // User's email
      console.log('User Photo URL:', user.photoURL); // User's profile photo URL
  
      // You can also update your UI with this info
      this.userName = user.displayName; 
      this.userEmail = user.email;
      this.userPhoto = user.photoURL;
    } else {
      console.log('No user logged in');
    }
  });
  

// Optionally handle the click event from Firebase button (this can be moved to your Vue component's method)
document.getElementById("authButton")?.addEventListener("click", function () {
  auth.currentUser
    ? signOut(auth)
    : signInWithPopup(auth, provider);
});

function loginOrOutACB(user){
    // demo render:
    console.log("user "+(user?" ID "+user.uid:user));
  
    // model.user= user
    // model.ready=false
    // readFromFirebase
  }