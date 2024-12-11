<template>
  <div class="details-presenter">
    <Details 
      :place=clickedMarkerPlace
      :placeDetails=clickedMarkerDetails
      :groupMembers=groupMembers
      @userinterested="handleUserInterested" 
      @close="handleUserClosingDetails"
    />
  </div>
</template>

    
    <script>
    import Details from '@/components/Details.vue';
    export default {
      components: {
          Details,
      },
      methods: {
      handleUserInterested(place) {
            console.log('User interested in:', place);
            this.$store.dispatch("userLikedHighlightedLocation", place); 
      },
      handleUserClosingDetails() {
            console.log('User closes details view ');
            this.$store.dispatch("userInterestedInLocation", null); //reset current highlighted place so that the details view closes
      },
    },
      computed:{
          clickedMarkerPlace() {
            return this.$store.getters.clickedMarkerPlace || null;
          },
          groupMembers() {
            return this.$store.getters.groupMembers || [];
          },
          clickedMarkerDetails(){
            return this.$store.getters.clickedMarkerDetails || null;
          }

      }
    };
    </script>
