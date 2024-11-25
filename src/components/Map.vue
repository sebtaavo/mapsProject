
<template>
  <div class="map-and-search">
    <div class="search-bar">
      <div class="search-input-container">
        <input type="text" placeholder="Search Location" class="search-input" id="search-input" />
      </div>
    </div>

    <div class="map-section">
      <div class="map-container">
        <GoogleMap
          :api-key="apiKey"
          style="width: 100%; height: 100%"
          :center="{ lat: lat, lng: lng }"
          :zoom="15"
        >
          <Marker :options="{ position: { lat: lat, lng: lng }, label: { text: 'S', color: 'blue' }, title: 'Your Location' }" />
          <Marker :options="{ position: { lat: lat + 0.001, lng: lng } }" />
        </GoogleMap>
      </div>
    </div>
  </div>
</template>

<script>
import { GoogleMap, Marker } from 'vue3-google-map';
import { APIkey } from '../js/apiKEY.js';

export default {
  components: {
    GoogleMap,
    Marker,
  },
  data() {
    return {
      apiKey: APIkey,
      lat: null,
      lng: null,
    };
  },
  created() {
    this.$getLocation()
      .then((coordinates) => {
        this.lat = coordinates.lat;
        this.lng = coordinates.lng;
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>

