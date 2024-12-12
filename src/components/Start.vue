<template>
    <div class="background-video-wrapper">
      <video autoplay loop muted class="background-video">
        <source src="../images/bgvideo.mp4" type="video/mp4" />
      </video>
      <div class="content-overlay">
        <!-- Add your other components here -->
        <h1>Where shall we meet?</h1>
        <span>This app uses device location tracking to function. Please allow device tracking.</span>
        <span>____________</span>
        <span>Log in to start using the app.</span>
        <button id="authButton" class="icon-container-start-page" @click="handleAuthClick">
        {{ authButtonText }}
      </button>
      </div>
    </div>
  </template>

<script>
export default {
  name: 'Start',
  props: {
    isAuthenticated: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    authButtonText() {
      return this.isAuthenticated ? 'Log out' : 'Log in';
    },
  },
  methods: {
    handleAuthClick() {
      this.$emit(this.isAuthenticated ? 'logout' : 'login');
    },
  },
};
</script>
