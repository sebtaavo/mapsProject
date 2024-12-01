<template>
  <div class = "map-and-search">
    <div class = "map-container">
      <Map @ready="handleMapReady" />
    </div>
    <div class = "search-container">
      <SearchBar :map = map></SearchBar>
    </div>
  </div>
</template>
  
  <script>
  import Map from '@/components/Map.vue'; // Import your child component
  import SearchBar from '@/components/SearchBar.vue';
  export default {

    components: {
        Map,
        SearchBar,
    },
    methods: {
      handleMapReady(mapInstance) {
        console.log('Received map instance in parent:', mapInstance);
        this.$store.dispatch("initMap", mapInstance); //send map to model.
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
        }
    }
  };
  </script>