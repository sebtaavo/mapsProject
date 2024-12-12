<template>
    <div v-if="place" id="details" class="sidebar">
      <button @click = "emitUserCloses" class="closeSidebarButton">X</button>
      <h2 class="place-name">{{ place.name }}</h2>
  
       <!-- Image conditional rendering -->
      <img 
        v-if="imageUrl" 
        :src="imageUrl" 
        alt="Photo of the place"
        class="place-image" 
      />
      <p class="address">{{ place.formatted_address }}</p>
  
        <div class="opening-hours" v-if="openingHours">
            <p><strong>Opening Hours:</strong></p>
            <!-- Display each day of the week if the weekday_text array exists -->
            <p 
              v-for="(day, index) in openingHours.weekday_text" 
              :key="index"
              class="opening-hours-item"
            >
              {{ day }}
            </p>
            <!-- Display the open_now status if it exists -->
            <p v-if="openingHours.open_now == 'See timetable above'">
              <strong>Status:</strong> See timetable above.
            </p>
            <p v-else-if="openingHours.open_now">
              <strong>Status:</strong> {{ openingHours.open_now ? "Open now" : "Closed now"}}
            </p>
        </div>

      <p class="rating">Rating: {{ place.rating || "N/A" }}/5</p>
  
      <p class="price-level">
        Price Level: {{ place.price_level !== undefined ? place.price_level : "N/A" }}/3
      </p>
      <p class="phone-number-details" v-if="placeDetails && placeDetails.international_phone_number">
        Phone number: {{ placeDetails.international_phone_number }}
      </p>
      <p class="phone-number-details" v-else>
        No phone number registered.
      </p>
      <p class="website-details" v-if="websiteString">
        {{ placeDetails.website }}
      </p>
      <p class="website-details" v-else-if="!websiteString">
        No website registered.
      </p>
      
      <button v-if="groupMembers.length !== 0" class="interest-button" @click="emitUserInterested">Pin me!</button>
    </div>
  </template>

  <script>
  export default {
    props: {
      place: Object,
      placeDetails: Object,
      groupMembers: Array,
    },
    methods: {
    emitUserInterested() {
      this.$emit('userinterested', this.place); 
    },
    emitUserCloses() {
      this.$emit('close'); 
    },
  },
  computed:{
    imageUrl() {
    if (this.placeDetails && this.placeDetails.photos && this.placeDetails.photos.length > 0) {
      // Check if the photos array contains objects with a .getUrl() method
      if (typeof this.placeDetails.photos[0].getUrl === 'function') {
        // If so, return the URL of the first photo by calling getUrl()
        return this.placeDetails.photos[0].getUrl();
      } else {
        // Otherwise, assume it's an array of strings and return the first string URL
        return this.placeDetails.photos[0];
      }
    } else if (this.place && this.place.photos && this.place.photos.length > 0) {
      // Fallback: if place has photos, check if they are objects or strings
      if (typeof this.place.photos[0].getUrl === 'function') {
        return this.place.photos[0].getUrl();
      } else {
        return this.place.photos[0];
      }
    }
    return null; // No image to display
  },
    openingHours() {
      console.log("Place: ", this.place);
      console.log("Place details: ", this.placeDetails);
      if(this.place._addedFromPersistence){
        return {
          weekday_text: this.place.opening_hours || [],
          open_now: "See timetable above",
        };
      }
      else if (this.placeDetails && this.placeDetails.opening_hours) {
        // If placeDetails has opening_hours, return both weekday_text and open_now if available
        return {
          weekday_text: this.placeDetails.opening_hours.weekday_text || [],
          open_now: this.placeDetails.opening_hours.isOpen || null,
        };
      } else if (this.place && this.place.opening_hours) {
        // Fallback to place.opening_hours if placeDetails is not available
        return {
          open_now: this.place.opening_hours.open_now || null,
        };
      }
      return null; // No opening hours to display
    },
    phoneNum() {
      if (this.placeDetails && this.placeDetails.international_phone_number) {
        // If placeDetails has opening_hours, return both weekday_text and open_now if available
        return this.placeDetails.international_phone_number;
      }
      return null; // No opening hours to display
    },
    websiteString() {
      if (this.placeDetails && this.placeDetails.website) {
        // If placeDetails has opening_hours, return both weekday_text and open_now if available
        return this.placeDetails.website;
      }
      return null; // No opening hours to display
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
    width: 95%;
    height: auto;
    margin: 16px auto;
    display: block;
    margin-top: -10px;
  }
  .place-name {
    width: 80%;
    height: auto;
    margin: 16px auto;
    display: block;
    margin-top: 20px;
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

