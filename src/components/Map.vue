<template>
  <div v-if="this.loading" style="display: flex; justify-content: center; align-items: center; height: 100%;">
      <img src="@/images/loadingspinner2.gif"/>
  </div>
  <div id="map" class="map"></div>
  <button id="authButton" class = "icon-container3" @click = "handleUpdatePosition">
    <img src="@/images/gpsicon.svg" alt="GPS Icon" class="gps-icon"/>
  </button>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      loading: true,
    };
  },
  async mounted() {
    await this.loadGoogleMapsAPI();

    await this.initMap();

    this.$emit("ready", this.map);
    this.loading = false;
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
      this.map._debug_id=1337;
    },
    updateMapCenter(lat, lng) {
      if (this.map) {
        this.map.setCenter({ lat, lng });
      }
    },
    handleUpdatePosition(){
      this.$emit('handlepositionupdate');
    },
  },
};
</script>

