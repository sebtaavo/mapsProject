import { initializeApp } from "firebase/app";
import config from "./firebaseConfig.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";

// Initialize Firebase app
const app = initializeApp(config);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// State management object
const authState = {
  user: null,
  authButtonText: 'Log in',
  userName: null,
  userEmail: null,
  userPhoto: null,
  
  // Method to update state
  updateUserState(user) {
    this.user = user;
    this.authButtonText = user ? 'Log out' : 'Log in';

    if (user) {
      console.log('User ID:', user.uid);
      console.log('User Name:', user.displayName);
      console.log('User Email:', user.email);
      console.log('User Photo URL:', user.photoURL);

      this.userName = user.displayName;
      this.userEmail = user.email;
      this.userPhoto = user.photoURL;
    } else {
      console.log('No user logged in');
      this.userName = null;
      this.userEmail = null;
      this.userPhoto = null;
    }
  }
};

// Handle authentication state change
onAuthStateChanged(auth, (user) => {
  authState.updateUserState(user);
});

// Authentication click handler
function handleAuthClick() {
  if (auth.currentUser) {
    signOut(auth);
  } else {
    signInWithPopup(auth, provider);
  }
}

// Optional: Add event listener if using a standalone button
const authButton = document.getElementById("authButton");
if (authButton) {
  authButton.addEventListener("click", handleAuthClick);
}

// Export for use in other parts of your application
export { 
  auth, 
  provider, 
  signInWithPopup, 
  signOut, 
  authState 
};