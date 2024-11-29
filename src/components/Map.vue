<template>
  <div class="map-and-search">
    <div class="search-bar">
      <div class="search-input-container">
        <input
          type="text"
          placeholder="Search Location"
          class="search-input"
          id="search-input"
          v-model="searchQuery"
          @keyup.enter="searchLocation"
        />
        <button class="search-button" @click="searchLocation">
          <img src="@/images/Search.svg" alt="Search" />
        </button>
      </div>
    </div>


    <div class="map-section">
      <div class="map-container">
        <GoogleMap
          v-if="lat !== null && lng !== null"
          :api-key="apiKey"
          style="width: 100%; height: 100%"
          :center="{ lat: lat, lng: lng }"
          :zoom="15"
        >
        <Marker
                v-if="lat !== null && lng !== null"
                :options="{ position: { lat: lat, lng: lng }, label: { text: 'S', color: 'blue' }, title: 'Your Location' }"
              />
              <Marker
                v-if="lat !== null && lng !== null"
                :options="{ position: { lat: lat + 0.001, lng: lng } }"
              />
        </GoogleMap>
      </div>
    </div>
  </div>
</template>


    <!-- 
    <div class="map-section">
      <div class="map-container">
        <GoogleMap
          v-if="lat !== null && lng !== null"
          :api-key="apiKey"
          style="width: 100%; height: 100%"
          :center="{ lat: mapViewLat, lng: mapViewLng }"
          :zoom="15"
        >
          <Marker
            v-if="lat !== null && lng !== null"
            :options="{ position: { lat: lat, lng: lng }, label: { text: 'S', color: 'blue' }, title: 'Your Location' }"
          />
          <Marker
            v-if="lat !== null && lng !== null"
            :options="{ position: { lat: lat + 0.001, lng: lng } }"
          />
        </GoogleMap>
      </div>
    </div>
  </div>
</template>
-->


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



<!--
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
      lat: null, // Marker latitude
      lng: null, // Marker longitude
      mapViewLat: null, // Center latitude for the map
      mapViewLng: null, // Center longitude for the map
      searchQuery: '',
    };
  },
  methods: {
    async searchLocation() {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            this.searchQuery
          )}&key=${this.apiKey}`
        );
        const data = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {li
          const location = data.results[0].geometry.location;
          this.mapViewLat = location.lat;
          this.mapViewLng = location.lng;
        } else {
          console.error('No results found for the given location.');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    },
  },
  created() {
    this.$getLocation()
      .then((coordinates) => {
        this.lat = coordinates.lat;
        this.lng = coordinates.lng;
        this.mapViewLat = coordinates.lat; // Initialize map view at the user's location
        this.mapViewLng = coordinates.lng;
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>
-->