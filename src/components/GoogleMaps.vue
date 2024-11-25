<template>
  <!-- Navbar -->
  <div class="navbar">
  <div class="logo">
    <img src="./images/PurpleUser.svg" class="user-icon" />
    <span class="title">GroupFinder</span>
  </div>
  <button class="icon-container">
  <img src="./images/User.svg" class="profile-icon" alt="Profile Icon" />
  <span class="profile-text">Profile</span>
</button>

</div>


  <!-- Main Content -->
  <div class="main-container">
    <div class="left-section">
      <!-- Map and Search Section -->
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
    </div>

    <!-- Sidebar -->
    <div class="sidebar">
      <div class="group-members">
        <h2 class="heading">Group Members</h2>
        <ul class="member-list">
          <li class="member-item">
            <img src="./images/User.svg" class="member-icon" alt="User Icon" />
            Sebastian Taavo Ek
          </li>
          <li class="member-item">
            <img src="./images/User.svg" class="member-icon" alt="User Icon" />
            Simon Lieb Fredriksson
          </li>
          <li class="member-item">
            <img src="./images/User.svg" class="member-icon" alt="User Icon" />
            Ben Dover
          </li>
          <li class="member-item">
            <img src="./images/User.svg" class="member-icon" alt="User Icon" />
            John Doe
          </li>
        </ul>
        <button class="group-button">Other Groups</button>
        <hr class="divider" />      
      </div>

    <div class="join-input-container">
      <input type="text" placeholder="     Join Through Key" class="join-input" id="join-input" />
    </div>
      
    <div class="categories">
    <button class="category-button">
        <img src="./images/Popcorn (1).svg" class="category-icon" alt="Cinemas Icon" />
        <span>Cinemas</span>
    </button>
    <button class="category-button">
        <img src="./images/Glass Martini alt (1).svg" class="category-icon" alt="Bars Icon" />
        <span>Bars</span>
    </button>
    <button class="category-button">
        <img src="./images/Waves (1).svg" class="category-icon" alt="Beaches Icon" />
        <span>Beaches</span>
    </button>
    <button class="category-button">
        <img src="./images/Paw (1).svg" class="category-icon" alt="Zoos Icon" />
        <span>Zoos</span>
    </button>
    <button class="category-button">
        <img src="./images/Basketball sharp (1).svg" class="category-icon" alt="Basketball Courts Icon" />
        <span>Basketball Courts</span>
    </button>
    <button class="category-button">
        <img src="./images/Football (1).svg" class="category-icon" alt="Football Fields Icon" />
        <span>Football Fields</span>
    </button>
    <button class="category-button">
        <img src="./images/Coffee cup (1).svg" class="category-icon" alt="Cafes Icon" />
        <span>Cafes</span>
    </button>
    <button class="category-button">
        <img src="./images/Library (1).svg" class="category-icon" alt="Libraries Icon" />
        <span>Libraries</span>
    </button>
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