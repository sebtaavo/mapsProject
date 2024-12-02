<template>
    <div class="search-component">
      <input class= "search-input"
        type="text"
        v-model="query"
        placeholder="Search for places"
        @keyup.enter="searchPlaces"
      />
      <button class ="searchButton" @click="searchPlaces">
        <img src="@/images/Search.svg" alt="Search" />  
      </button>
      <!-- 
      <div v-if="latestPlaceSearch.length > 0" class="results">
        <h3>Search Results:</h3>
        <ul>
          <li v-for="place in latestPlaceSearch" :key="place.placeId">
            <strong>{{ place.name }}</strong>
            <p>{{ place.formatted_address }}</p>
          </li>
        </ul>
      </div>
      <div v-if="latestPlaceSearch.length === 0" class="no-results">
        <p>No results found for your search.</p>
      </div>
      -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      map: Object, // Accept map as a prop from the parent
    },
    data() {
      return {
        query: "",
        places: [],
      };
    },
    computed: {
      // Access the latest place search results from Vuex
      latestPlaceSearch() {
        return this.$store.getters.latestPlaceSearch || [];
      },
      locationMapMarkers() {
        return this.$store.getters.locationMapMarkers || [];
      }
    },
    methods: {
      async searchPlaces() {
        if (!this.query.trim()) {
          alert("Please enter a search query.");
          return;
        }
  
        try {
          const { PlacesService } = await google.maps.importLibrary("places");
  
          const request = {
            query: this.query,
            fields: ["name", "geometry", "business_status"],
          };
  
          const service = new PlacesService(this.map); // Use the map passed as a prop
  
          service.textSearch(request, async (results, status) => {
            console.log('Search results:', results);
            console.log('Search status:', status);
            console.log(this.map);
            this.$store.dispatch('clearMarkers');
  
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              this.places = results;
              this.$store.dispatch('updateLatestPlaceSearch', results);
  
              if (this.map instanceof google.maps.Map) {
                const { LatLngBounds } = await google.maps.importLibrary("core");
                const bounds = new LatLngBounds();
  
                //add marker coordinates to model
                results.forEach((place) => {
                  const mapMarker = new google.maps.Marker({
                    map: this.map,
                    position: place.geometry.location,
                    title: place.name,
                  });
                  bounds.extend(place.geometry.location);
                  this.$store.dispatch('addLocationMarker', mapMarker);
                });
                console.log("Stored markers: ", this.$store.getters.locationMapMarkers);
  
                this.map.fitBounds(bounds); // Fit map to bounds of the markers
              } else {
                console.error("Map is not valid");
              }
            } else {
              this.places = [];
              alert("No results found.");
            }
          });
        } catch (error) {
          console.error("Error fetching places:", error);
          alert("An error occurred while fetching places.");
        }
      },
    },
  };
  </script>
  
