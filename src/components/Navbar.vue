<template>
  <div class="navbar">
    <div class="logo">
      <img src="@/images/PurpleUser.svg" class="user-icon" />
      <span class="title">GroupFinder</span>
    </div>
    <div class="auth-section">
      <button id="authButton" class="icon-container" @click="handleAuthClick">
        {{ authButtonText }}
      </button>
    </div>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import config from "@/js/firebaseConfig.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

export default {
  name: 'Navbar',
  data() {
    return {
      authButtonText: 'Log in or out',  // Default button text
      user: null,  // Store the user object
    };
  },
  mounted() {
    // Initialize Firebase authentication
    const app = initializeApp(config);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    // Listen to authentication state changes
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.authButtonText = user ? 'Log out' : 'Log in'; // Update button text based on auth state

      if (user) {
        console.log('User ID:', user.uid);
        console.log("User's name:", user.displayName);
        console.log('User Email:', user.email);  
      } else {
        console.log('No user logged in'); // If no user is logged in
      }
    });
  },
  methods: {
    async handleAuthClick() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      if (this.user) {
        // Sign out if the user is already logged in
        await signOut(auth);
        this.user = null;
      } else {
        // Sign in with Google
        await signInWithPopup(auth, provider);
      }
    },
  },
};
</script>
