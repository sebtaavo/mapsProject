<template>
    <div v-if="place" id="details" class="sidebar">
      <!-- Title -->
      <h2>{{ place.name }}</h2>
  
      <!-- Image -->
      <img 
        v-if="place.photos" 
        :src="place.photos[0].getUrl()" 
        alt="Photo of the place"
        class="place-image"
      />
  
      <!-- Address -->
      <p class="address">{{ place.formatted_address }}</p>
  
      <!-- Opening Hours -->
      <p class="opening-hours">
        {{ place.openingHours && place.openingHours.isOpen() ? "Open now" : "Closed now" }}
      </p>
  
      <!-- Rating -->
      <p class="rating">Rating: {{ place.rating || "N/A" }}/5</p>
  
      <!-- Price Level -->
      <p class="price-level">
        Price Level: {{ place.price_level !== undefined ? place.price_level : "N/A" }}/3
      </p>
       <!-- This emits to parent component that we want to store this suggestion to persistence.-->
      <button class="interest-button" @click="emitUserInterested">I'm Interested</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      place: Object, // Takes in the relevant place object
    },
    methods: {
    emitUserInterested() {
      this.$emit('userinterested', this.place); // Emit event with the place object as payload
    },
  },
  };
  </script>
  
  <style scoped>
  .details {
    padding: 16px;
    font-family: Arial, sans-serif;
    margin-left: 20px;
  }

  #details h2{
    margin-left: 20px;
    text-decoration: underline;
  }
  
  .place-image {
    width: 100%;
    height: auto;
    margin: 16px 0;
    margin-left: 20px;
  }
  
  .address,
  .rating,
  .price-level {
    margin: 8px 0;
    margin-left: 20px;
  }

  .opening-hours {
  margin: 8px 0;
  margin-left: 20px;
  font-style: italic; /* Makes the text italicized */
}
  </style>