<template>
    <div class="sidebar" v-if="!place">
      <div class="group-members" v-if="groupMembers">
        <h2 class="heading">Group Members</h2>
        <ul class="member-list" >
          <li v-if="!user" class="member-item">
            Please log in to use the app.
          </li>
          <li v-else-if="groupMembers.length === 0" class="member-item">
            Join or create a group to get started!
          </li>
          <li
            v-if="user"
            v-for="(member, index) in groupMembers"
            :key="member.uid"
            class="member-item"
            @click="handleMemberWasClicked(member)"
          >
            <img :src="member.icon || 'path_to_default_icon_or_gravatar'" class="member-icon" alt="User Icon" />
            {{ member.name }}
            <span v-if="member.uid === adminUid" class="admin-label">(Admin)</span>
            <button
              v-if="user.uid === adminUid && member.uid !== adminUid"
              class="kick-button"
              @click="handleKickMember(member)"
            >
              Kick
            </button>
          </li>
        </ul>
        <button v-if="groupMembers.length !== 0" class="group-button" @click="handleLeaveGroup">Leave Group</button>
        <hr class="divider" />
      </div>
  
  
      <div class="join-input-container">
        <input
          type="text"
          :value="groupMembers.length ? groupKey : writtenGroupKey"
          placeholder="Join Through Key"
          class="join-input"
          id="join-input"
          @keyup.enter="handleJoinGroup"
          @input="handleUpdateGroupKey"
          :disabled="groupMembers.length !==0"
        />
      </div>
  
      <div v-if="user && groupKey==''" class="create-group-container">
        <button class="create-group-button" @click="handleCreateGroup">
          Create Your Own Group
        </button>
      </div>


    <!-- NEW SECTION FOR HIGHLIGHTED PLACES TAKEN FROM THE GROUP IN PERSISTENCE DYNAMICALLY-->
    <div class="highlighted-places" v-if="groupHighlightedPlaces !== []">
    <div 
      v-for="(place, index) in groupHighlightedPlaces" 
      :key="index" 
      class="place-row"
    >
      <!-- Place Icon -->
      <img :src="place.icon" alt="Place Icon" class="place-icon" @click="highlightWasClicked(groupHighlightedPlaces[index])"/>
      
      <!-- Place Name -->
      <span class="place-name" @click="highlightWasClicked(groupHighlightedPlaces[index])">{{ place.name }}</span>
      
      <!-- Remove Button -->
      <button class="remove-button" @click="removeHighlightForAll(groupHighlightedPlaces[index])">
        ✖
      </button>
    </div>
    </div>
    </div>
  </template>


<script>
export default {
  name:'SidebarTest',
  mounted() {

    },
    emits: [
    'join-group',
    'leave-group',
    'kick-member',
    'create-group',
    'clicked-member',
    'keyupdate',
    'clicked-highlight',
    'remove-highlight',
  ], // Declare custom events
    props: {
        user: {
        type: Object,
        },
        place: {
        type: Object,
        },
        groupMembers: {
        type: Array,
        },
        adminUid: {
        type: String,
        },
        groupKey: {
        type: String,
        },
        writtenGroupKey: {
        type: String,
        },
        kickedMembers: {
        type: Array,
        },
        groupHighlightedPlaces : {
          type: Array,
        },
    },
    methods: {
        handleJoinGroup() {
            this.$emit('join-group'); // Emit the event to parent component
        },
        handleLeaveGroup() {
            this.$emit('leave-group'); // Emit the event to parent component
        },
        handleKickMember(member) {
            this.$emit('kick-member', member); // Emit the event to parent with the member ID
        },
        handleCreateGroup() {
            this.$emit('create-group'); // Emit the event to parent component
        },
        handleMemberWasClicked(member) {
            this.$emit('clicked-member', member); // Emit the event to parent component
        },
        handleUpdateGroupKey(ev){
            console.log("Input event: ", ev);
            console.log("Input event target value: ", ev.target.value);
            this.$emit('keyupdate', ev.target.value);
        },
        highlightWasClicked(place){
          this.$emit('clicked-highlight', place); // Emit the event to parent component
        },
        removeHighlightForAll(place){
          this.$emit('remove-highlight', place); // Emit the event to parent component
        },
  },
};
</script>

<!--THIS WILL HAVE TO BE MOVED TO STYLE.CSS IN THE END-->
<style scoped>
/*container for the list */
.highlighted-places {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Add spacing between rows */
  margin-top:35;
  margin-left:20;
}

/* sstyling for each row */
.place-row {
  display: flex;
  align-items: center;
  gap: 8px; /* Add spacing between items in the row */
}

/*styling for image*/
.place-icon {
  width: 32px;
  height: 32px;
  object-fit: contain; /* Ensure the icon fits within the bounds */
}

/*text style*/
.place-name {
  flex-grow: 1; /* Ensure the name takes up remaining space */
  font-size: 16px;
  color: #333;
}

/*removal button*/
.remove-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}
/*For hover on removal btn*/
.remove-button:hover {
  color: red; /* Change color on hover for better UX */
}
</style>