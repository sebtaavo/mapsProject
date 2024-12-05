<template>
    <div class = "details-presenter">
        <Details :place=clickedMarkerPlace @userinterested="handleUserInterested" />
    </div>
  </template>
    
    <script>
    import Details from '@/components/Details.vue';
    export default {
      components: {
          Details
      },
      methods: {
        handleUserInterested(place) {
            console.log('User interested in:', place);
            this.$store.dispatch("userLikedHighlightedLocation", place); //send map to model.
      },
    },
      computed:{
            clickedMarkerPlace() {
            return this.$store.getters.clickedMarkerPlace || null;
          },
      }
    };
    </script>