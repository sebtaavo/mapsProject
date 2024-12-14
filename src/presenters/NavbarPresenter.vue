<template>
    <div>
      <Navbar :isAuthenticated="isAuthenticated" @login="login" @logout="logout" @handlesaves="manageSaves"/>
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
      ...mapActions(["login", "logout", "manageSaves"]),
    },
    created() {
      this.$store.dispatch("initializeAuth");
    },
  };
  </script>

  