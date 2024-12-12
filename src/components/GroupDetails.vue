<template>
    <div class = "scrollablemaybe">
      <div v-for="member in groupMembers" :key="member.uid" class="group-member">
        <h3>{{ member.name }}</h3>
        
        <!-- Find the matching groupDirections entry by uid -->
        <div v-if="matchingDirection(member.uid)">
          <div v-for="(step, index) in matchingDirection(member.uid).directions.routes[0].legs[0].steps" :key="index" class="direction-step">
            <div class="step-info">
              <p><strong>Step {{ index + 1 }}:</strong></p>
              <p><strong>Instructions:</strong> {{ step.instructions }}</p>
              <p><strong>Travel Mode:</strong> {{ step.travel_mode }}</p>
              <p><strong>Distance:</strong> {{ step.distance.text }}</p>
              <p><strong>Duration:</strong> {{ step.duration.text }}</p>
            </div>
          </div>
  
          <div class="summary">
            <p><strong>Distance to Travel:</strong> {{ matchingDirection(member.uid).directions.routes[0].legs[0].distance.text }}</p>
            <p><strong>Time to Travel:</strong> {{ matchingDirection(member.uid).directions.routes[0].legs[0].duration.text }}</p>
            <p><strong>Arrival Time:</strong> {{ matchingDirection(member.uid).directions.routes[0].legs[0].arrival_time.text }}</p>
            <p><strong>Departure Time:</strong> {{ matchingDirection(member.uid).directions.routes[0].legs[0].departure_time.text }}</p>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      groupDirections: Array,
      place: Object,
      placeDetails: Object,
      groupMembers: Array,
    },
    methods: {
      // Method to find the matching direction object based on uid
      matchingDirection(uid) {
        return this.groupDirections.find(direction => direction.uid === uid);
      }
    }
  };
  </script>
  
  <style scoped>
  .scrollablemaybe {
    overflow-x: hidden; /* Disable horizontal scrolling */
    overflow-y: auto;   /* Enable vertical scrolling */
    max-height: 97.6%;  /* Adjust to the desired height */
    padding: 10px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  
  .group-member {
    margin-bottom: 20px;
    color: white
  }
  
  .group-member h3 {
    font-size: 1.2em;
    color: white
  }
  
  .direction-step {
    background-color: #000000;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  
  .summary {
    margin-top: 10px;
  }
  
  .summary p {
    margin: 5px 0;
  }
  </style>
  
  
