<template>
  <div class = "map-and-search">
    <div class = "map-container" v-if="!userCoordsEmpty">
      <Map @ready="handleMapReady" @coords="handleUserCoords"/>
    </div>
    <div class = "map-container" v-if="userCoordsEmpty">
      <MapError @coords="handleUserCoords"/>
    </div>
    <div class = "search-container" v-if="!userCoordsEmpty">
      <SearchBar @search-for-places="handleSearchMapWithCurrentQuery" @update-search-query="handleUpdateSearchQuery"></SearchBar>
    </div>
  </div>
</template>
  
  <script>
  import Map from '@/components/Map.vue'; // Import your child component
  import SearchBar from '@/components/SearchBar.vue';
  import MapError from '@/components/MapError.vue';
  export default {

    components: {
        Map,
        SearchBar,
        MapError,
    },
    methods: {
      handleMapReady(mapInstance) {
        console.log('Received map instance in parent:', mapInstance);
        this.$store.dispatch("initMap", mapInstance); //send map to model.
      },
      handleUserCoords(coords) {
        console.log('Received user coords in parent:', coords);
        this.$store.dispatch("updateUserCoords", coords); //send map to model.
      },
      handleUpdateSearchQuery(value) {
        console.log('Received order to update search query in parent:', value);
        this.$store.dispatch("updateCurrentMapSearchQuery", value); //send map to model.
      },
      handleSearchMapWithCurrentQuery() {
        console.log('Received order to perform map search in parent.');
        this.$store.dispatch("searchMapWithCurrentQuery"); //send map to model.
      },
    },
    computed:{
        latestPlaceSearch() {
          return this.$store.getters.latestPlaceSearch || [];
        },
        locationMapMarkers() {
          return this.$store.getters.locationMapMarkers || [];
        },
        map(){
          return this.$store.getters.map || null;
        },
        userCoordsEmpty() {
          if(this.$store.getters.userCoords === null ||this.$store.getters.userCoords === undefined){
            return true;
          }
          return Object.keys(this.$store.getters.userCoords).length === 0 && this.$store.getters.userCoords.constructor === Object;
        },
    },
    async created(){
    try {
      const coords = await this.$getLocation(); 
      this.$store.dispatch('updateUserCoords', coords);
    } catch (error) {
      console.error('Failed to fetch user location:', error);
    }
    }
  };
  </script>