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
      authButtonText: 'Log in',  // Start with 'Log in'
      user: null,  // Store the user object
      auth: null,  // Store the auth instance
      provider: null  // Store the auth provider
    };
  },
  created() {
    // Initialize Firebase authentication in the created hook
    const app = initializeApp(config);
    this.auth = getAuth(app);
    this.provider = new GoogleAuthProvider();

    // Listen to authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      // Ensure we're using this.user to update the component's state
      this.user = user;
      this.authButtonText = user ? 'Log out' : 'Log in';
    });
  },
  methods: {
    async handleAuthClick() {
      try {
        if (this.user) {
          // Sign out if the user is already logged in
          await signOut(this.auth);
        } else {
          // Sign in with Google
          await signInWithPopup(this.auth, this.provider);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    },
  },
}
</script>