<template>
    <div>
      <Start :isAuthenticated="isAuthenticated" @login="login" @logout="logout" />
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  import Start from "@/components/Start.vue";
  
  export default {
    name: "NavbarPresenter",
    components: {
      Start,
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

  