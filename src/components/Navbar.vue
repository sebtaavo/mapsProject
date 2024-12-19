<template>
  <div class="navbar">
    <div class="logo">
      <img src="@/images/PurpleUser.svg" class="user-icon" />
      <span class="title">Where do we meet?</span>
    </div>
    <div class="auth-section">
      <button id="authButton" class = "icon-container2" @click = "handleUpdatePosition">
        <img src="@/images/gpsicon.svg" alt="GPS Icon" />
      </button>
      <button v-if="savedGroups.length" id="authButton" class="icon-container2" @click="handleManageSavedGroups">
        Manage Previous groups
      </button>
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
    savedGroups: {
      type: Array,
    },
  },
  computed: {
    authButtonText() {
      return this.isAuthenticated ? 'Log out' : 'Log in';
    },
    authenticated() {
      return this.isAuthenticated;
    },
  },
  methods: {
    handleAuthClick() {
      this.$emit(this.isAuthenticated ? 'logout' : 'login');
    },
    handleManageSavedGroups(){
      this.$emit('handlesaves');
    },
    handleUpdatePosition(){
      this.$emit('handlepositionupdate');
    },
  },
};
</script>