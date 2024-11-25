<template>
  <div class="main-container">
    <!-- Left Section: Map and Search -->
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

      <!-- Search Bar -->
      <div class="search-bar">
        <input type="text" placeholder="Search Location" class="search-input" id="search-input" />
      </div>

      <!-- Map Section -->
      <div class="map-section">
        <div class="map-container">
          <GoogleMap
            :api-key= "apiKey"
            style="width: 100%; height: 100%"
            :center="{ lat: lat, lng: lng }"
            :zoom="15"
          >
            <Marker :options="{ position: {lat: lat, lng: lng}, label: {text: 'S', color: 'blue'}, title: 'Your Location'}" />
            <Marker :options="{ position: {lat: lat + 0.001, lng: lng} }" />
          </GoogleMap>
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

<style>
body {
    background-color: #1a202c;
    color: #ffffff;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  
  .main-container {
    display: flex;
    height: 100vh;
  }
  
  /* Left Section */
  .left-section {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #181A1B;
    padding: 1rem 1.5rem;
  }
  
  .logo {
    display: flex;
    align-items: center;
  }
  
  .logo .icon {
    height: 1.5rem;
    width: 1.5rem;
    color: #9f7aea;
    margin-right: 0.5rem;
  }
  
  .title {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .icon-container .icon {
    height: 1.5rem;
    width: 1.5rem;
  }
  
  .search-bar {
    padding: 1rem 1.5rem;
    background-color: #2d3748;
  }
  
  .search-input {
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    background-color: #4a5568;
    color: #ffffff;
    border: none;
  }
  
  .map-section {
    flex: 1;
    position: relative;
  }
  
  .map-container {
    width: 100%;
    height: 100%;
  }
  
  #map {
    width: 100%;
    height: 100%;
  }
  
  /* Right Section */
  .sidebar {
    width: 24rem;
    background-color: #181A1B;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .group-members {
    padding: 1.5rem;
  }
  
  .heading {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .member-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .member-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .group-button {
    margin-top: 1rem;
    width: 100%;
    padding: 0.5rem;
    background-color: #1E2021;
    color: #ffffff;
    border-radius: 9999px;
    border: none;
    cursor: pointer;
  }
  
  .group-button:hover {
    background-color: #9f7aea;
  }
  
  .categories {
    padding: 1.5rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  
  .category-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #9f7aea;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  /* Custom styles for Leaflet map */
  .leaflet-container {
    background-color: #1a202c;
  }
  
  .leaflet-control-zoom a {
    background-color: #2d3748;
    color: #ffffff;
    border: none;
  }
  
  .leaflet-control-zoom a:hover {
    background-color: #4a5568;
  }
  
</style>
