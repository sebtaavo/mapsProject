<template>
    <div id="map" class="map">
        <span class="no-map-text">You are seeing this because you have not given the app access to your location.
        Enable device location tracking in your browser, and then proceed by clicking the button
        below and refreshing the page.</span>
        <button id="authButton" class="icon-container-start-page" @click="findMe">Update my position</button>

    </div>
  </template>
  
  <script>
  import {throwRegularAlert} from '../js/Data.js';
  export default {
    methods: {
      async findMe() {
        try{
            const coords = await this.$getLocation();
            this.$emit("coords", {lat: coords.lat, lng: coords.lng});
        }
        catch(error){
            throwRegularAlert("Device location tracking not enabled", "To proceed with using the app, please enable device location tracking. This can be done by opening the menu in the leftmost icon of your URL input field in the browser.", null);
        }
      },
    },
  };
  </script>
  
  