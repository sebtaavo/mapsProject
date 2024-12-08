<template>
    <div>
      <Navbar :isAuthenticated="isAuthenticated" @login="login" @logout="logout" />
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import Navbar from "@/components/Navbar.vue";
  
  export default {
    name: "NavbarPresenter",
    components: {
      Navbar,
    },
    computed: {
      ...mapGetters(["isAuthenticated"]),
    },
    methods: {
      ...mapActions(["login", "logout"]),
    },
    created() {
      this.$store.dispatch("initializeAuth");
    },
  };
  </script>

  