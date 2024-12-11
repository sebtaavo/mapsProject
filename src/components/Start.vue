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


<style scoped>
.background-video-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the video covers the whole area */
  z-index: -1; /* Sends the video behind other content */
}

.content-overlay {
  position: relative;
  z-index: 1; /* Ensures content appears above the video */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white; /* Adjust text color for better visibility */
}

</style>