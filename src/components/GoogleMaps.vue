<template>
  <div class="main-container">
<div class="left-section">
  <!-- Navbar -->
  <div class="navbar">
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="title">GroupFinder</span>
    </div>
    <div class="icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5a7.5 7.5 0 015.657 12.657A7.5 7.5 0 016.343 6.343 7.5 7.5 0 0112 4.5zM12 12v6m0-6a2 2 0 10-4 0v6m0-6a2 2 0 114 0v6" />
      </svg>
    </div>
  </div>

  <!-- Map and Search Section -->
  <div class="map-and-search">
    <!-- Search Bar -->
    <div class="search-bar">
      <input type="text" placeholder="Search Location" class="search-input" id="search-input" />
    </div>

    <!-- Map Section -->
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
</div>


    <!-- Right Section: Sidebar -->
    <div class="sidebar">
      <div class="group-members">
        <h2 class="heading">Group Members</h2>
        <ul class="member-list">
          <li class="member-item">Sebastian Taavo Ek</li>
          <li class="member-item">Simon Lieb Fredriksson</li>
          <li class="member-item">Ben Dover</li>
          <li class="member-item">John Doe</li>
        </ul>
        <button class="group-button">Other Groups</button>
      </div>
      <div class="categories">
        <button class="category-button">Cinemas</button>
      </div>
    </div>
  </div>
</template>

<script>
import { GoogleMap, Marker } from 'vue3-google-map';
import{APIkey} from '../js/apiKEY.js';

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