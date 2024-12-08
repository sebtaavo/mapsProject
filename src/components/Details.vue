<template>
    <div v-if="place" id="details" class="sidebar">
      <button @click = "emitUserCloses" style="float:right">X</button>
      <h2>{{ place.name }}</h2>
  
      <img 
        v-if="place.photos" 
        :src="place.photos[0].getUrl()" 
        alt="Photo of the place"
        class="place-image"
      />
      <img
        v-if="place.photo" 
        :src="place.photo" 
        alt="Photo of the place"
        class="place-image"
      />
  
      <p class="address">{{ place.formatted_address }}</p>
  
      <p class="opening-hours">
        {{ place.openingHours || 'N/A'}}
      </p>

      <p class="rating">Rating: {{ place.rating || "N/A" }}/5</p>
  
      <p class="price-level">
        Price Level: {{ place.price_level !== undefined ? place.price_level : "N/A" }}/3
      </p>
      
      <button class="interest-button" @click="emitUserInterested">Pin me!</button>
    </div>
  </template>

  <script>
  export default {
    props: {
      place: Object, // Takes in the relevant place object
    },
    methods: {
    emitUserInterested() {
      this.$emit('userinterested', this.place); 
    },
    emitUserCloses() {
      this.$emit('close'); 
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
    font-style: italic;
}
  
  </style>
