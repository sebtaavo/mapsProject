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
export default {
  name: 'Navbar',
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