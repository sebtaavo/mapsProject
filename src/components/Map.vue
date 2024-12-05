<template>
  <div id="map" class="map"></div> <!-- Container for the map -->
</template>

<script>
export default {
  data() {
    return {
      map: null,
    };
  },
  async mounted() {
    // Ensure the Google Maps API is fully loaded before initializing the map
    await this.loadGoogleMapsAPI();

    // Now that Google Maps is loaded, initialize the map
    await this.initMap();

    // Emit the map instance once it's ready
    this.$emit("ready", this.map); // Emit the map to parent
  },
  methods: {
    // Method to check if Google Maps API is ready
    loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (typeof google !== "undefined" && google.maps) {
          // The Google Maps API is already loaded
          resolve();
        } else {
          // Wait for the script to load
          window.addEventListener("load", () => {
            if (typeof google !== "undefined" && google.maps) {
              resolve();
            } else {
              reject("Google Maps API failed to load");
            }
          });
        }
      });
    },

    // Initialize the map
    async initMap() {
      const { Map } = await google.maps.importLibrary("maps");
      const coords = await this.$getLocation();
      this.$emit("coords", {lat: coords.lat, lng: coords.lng});
      this.map = new Map(document.getElementById("map"), {//here we bind the map to the div
        center: { lat: coords.lat, lng: coords.lng }, 
        zoom: 12,
      });
    },

    // Example method to update the map later
    updateMapCenter(lat, lng) {
      if (this.map) {
        this.map.setCenter({ lat, lng });
      }
    },
  },
};
</script>
