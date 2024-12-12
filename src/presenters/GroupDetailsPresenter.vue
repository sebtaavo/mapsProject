<template>
    <div class="group-details-presenter" v-if="groupDetailsOpenBool">
      <GroupDetails 
        :place=clickedMarkerPlace
        :placeDetails=clickedMarkerDetails
        :groupMembers=groupMembers
        :groupDirections=groupDirections
      />
    </div>
  </template>
  
      
      <script>
      import GroupDetails from '@/components/GroupDetails.vue';
      export default {
        components: {
            GroupDetails,
        },
        methods: {

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
            },
            groupDirections(){
                return this.$store.getters.latestGroupDirectionSearch || [];
            },
            groupDetailsOpenBool(){
                return this.$store.getters.groupDetailsOpen || false;
            },
        }
      };
      </script>
  