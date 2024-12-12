<template>
  <div class="scrollablemaybe">
    <!-- Check if a member is selected -->
    <div v-if="selectedMember">
      <button @click="clearSelection">&lt; Back</button>
      <h4>{{ selectedMember.name }}'s Travel Instructions</h4>
      <div v-if="matchingDirection(selectedMember.uid)">
        <div v-for="(step, index) in matchingDirection(selectedMember.uid).directions.routes[0].legs[0].steps" :key="index" class="direction-step">
          <div class="step-info">
            <p><strong>Step {{ index + 1 }}:</strong></p>
            <p><strong>Instructions:</strong> {{ step.instructions }}</p>
            <p><strong>Travel Mode:</strong> {{ step.travel_mode }}</p>
            <p><strong>Distance:</strong> {{ step.distance.text }}</p>
            <p><strong>Duration:</strong> {{ step.duration.text }}</p>
          </div>
        </div>

        <div class="summary">
          <p><strong>Distance to Travel:</strong> {{ matchingDirection(selectedMember.uid).directions.routes[0].legs[0].distance.text }}</p>
          <p><strong>Time to Travel:</strong> {{ matchingDirection(selectedMember.uid).directions.routes[0].legs[0].duration.text }}</p>
          <p><strong>Arrival Time:</strong> {{ matchingDirection(selectedMember.uid).directions.routes[0].legs[0].arrival_time.text }}</p>
          <p><strong>Departure Time:</strong> {{ matchingDirection(selectedMember.uid).directions.routes[0].legs[0].departure_time.text }}</p>
        </div>
      </div>
    </div>

    <!-- Show list of members if no member is selected -->
    <div v-else>
      <div v-for="member in groupMembers" :key="member.uid" class="member-box" @click="selectMember(member)">
        <h3>{{ member.name }}</h3>
        <p><strong>Travel Time:</strong> {{ matchingDirection(member.uid)?.directions.routes[0].legs[0].duration.text || 'N/A' }}</p>
        <p><strong>Distance:</strong> {{ matchingDirection(member.uid)?.directions.routes[0].legs[0].distance.text || 'N/A' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groupDirections: Array,
    groupMembers: Array,
  },
  data() {
    return {
      selectedMember: null,
    };
  },
  methods: {
    matchingDirection(uid) {
      return this.groupDirections.find(direction => direction.uid === uid);
    },
    selectMember(member) {
      this.selectedMember = member;
    },
    clearSelection() {
      this.selectedMember = null;
    },
  },
};
</script>

<style scoped>
.scrollablemaybe {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 97.6%;
  padding: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  width: 300px;
}

.member-box {
  background-color: #1E2021;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  margin-right: -10px;
  margin-left: 5px;
  word-wrap: break-word;
  
}

.member-box:hover {
  background-color: #333333;
}

.direction-step {
  background-color: #000000;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  word-wrap: break-word;
}

.summary {
  margin-top: 10px;
  word-wrap: break-word;
}

button {
  background-color: #444;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  user-select:  none;
}

button:hover {
  background-color: #666;
}
</style>
