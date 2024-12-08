import { initializeApp } from "firebase/app";
import config from "./firebaseConfig.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";

const app = initializeApp(config);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const authState = {
  user: null,
  authButtonText: 'Log in',
  userName: null,
  userEmail: null,
  userPhoto: null,

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

onAuthStateChanged(auth, (user) => {
  authState.updateUserState(user);
});

function handleAuthClick() {
  if (auth.currentUser) {
    signOut(auth);
  } else {
    signInWithPopup(auth, provider);
  }
}

const authButton = document.getElementById("authButton");
if (authButton) {
  authButton.addEventListener("click", handleAuthClick);
}

export { 
  auth, 
  provider, 
  signInWithPopup, 
  signOut, 
  authState
};