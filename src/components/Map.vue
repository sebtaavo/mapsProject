<template>
  <div id="map" class="map"></div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
    };
  },
  async mounted() {
    await this.loadGoogleMapsAPI();

    await this.initMap();

    this.$emit("ready", this.map);
  },
  methods: {
    loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (typeof google !== "undefined" && google.maps) {
          resolve();
        } else {
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
    async initMap() {
      const { Map } = await google.maps.importLibrary("maps");
      const coords = await this.$getLocation();
      this.$emit("coords", {lat: coords.lat, lng: coords.lng});
      this.map = new Map(document.getElementById("map"), {
        center: { lat: coords.lat, lng: coords.lng }, 
        zoom: 12,
      });
    },
    updateMapCenter(lat, lng) {
      if (this.map) {
        this.map.setCenter({ lat, lng });
      }
    },
  },
};
</script>

