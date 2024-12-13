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

      <!-- Dropdown to select saved group -->
      <div v-if="savedGroups.length" class="dropdown-container">
        <label for="saved-group-select">Select a Saved Group:</label>
        <select id="saved-group-select" @change="handleGroupSelect" class="dropdown">
          <option value="">-- Select a Group --</option>
          <option
            v-for="group in savedGroups"
            :key="group.key"
            :value="group.key"
          >
            {{ group.name }}
          </option>
        </select>
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
        <button class="create-group-button" @click="handleRequestCreateGroup">
          Create Your Own Group
        </button>
      </div>
      <div class="highlighted-places" style="cursor: pointer; user-select: none;" v-if="groupHighlightedPlaces.length > 0">
    <div 
      v-for="(place, index) in groupHighlightedPlaces" 
      :key="index" 
      class="place-row">

      <img :src="place.icon" alt="Place Icon" class="place-icon" @click="highlightWasClicked(groupHighlightedPlaces[index])"/>
      
      <span class="place-name" style="color: white" @click="highlightWasClicked(groupHighlightedPlaces[index])">{{ place.name }}</span>

      <button class="remove-button" @click="removeHighlightForAll(groupHighlightedPlaces[index])">
        ✖
      </button>
    </div>
    </div>
    </div>
  </template>


<script>
import Swal from 'sweetalert2';
export default {
  name:'SidebarTest',
  data(){
    return {
      grpNum: 0,
    };
  },
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
    'groupselected',
    'actually-create-group',
    'close-prompt',
  ], 
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
        savedGroups:{
        type: Array,
        },
        adminUid: {
        type: String,
        },
        prompt: {
          type: Boolean,
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
        handleGroupSelect(event) {
          console.log("Entered dropdown event receiver with value: ", event.target.value);
          const selectedKey = event.target.value;
          if (selectedKey) {
            this.$emit('groupselected', selectedKey); // Emit selected group key
          }
        },
        handleJoinGroup() {
            this.$emit('join-group');
        },
        handleLeaveGroup() {
            this.$emit('leave-group');
        },
        handleKickMember(member) {
            this.$emit('kick-member', member);
        },
        handleRequestCreateGroup() {
    this.$emit('create-group'); 

          //this uses a custom dialogue component from sweetalert2: https://sweetalert2.github.io/
    Swal.fire({
      title: 'Choose a group name',
      text: 'The invite key is generated separately after this step. Copy and send the key to your friends!',
      input: 'text', // Enables a prompt input
      inputPlaceholder: 'Enter group name...',
      backdrop: true,
      showCancelButton: true,
      confirmButtonText: 'OK',
      color: '#fff',
      background: '#181A1B',
      confirmButtonColor: '#9F7AEA',
      cancelButtonColor: '#FF0000',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'custom-dialog-popup', // Custom popup class
        title: 'custom-dialog-title', // Custom title class
        input: 'custom-dialog-input', // Custom input field class
        confirmButton: 'custom-confirm-btn', // Custom confirm button class
        cancelButton: 'custom-cancel-btn' // Custom cancel button class
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('OK clicked:', result.value);
        // Handle the confirmed value here
        this.$emit('actually-create-group', result.value || 'Default Group Name');
      } else if (result.isDismissed) {
        console.log('User canceled or closed the dialog');
      }
    });
      },
        handleMemberWasClicked(member) {
            this.$emit('clicked-member', member); 
        },
        handleUpdateGroupKey(ev){
            console.log("Input event: ", ev);
            console.log("Input event target value: ", ev.target.value);
            this.$emit('keyupdate', ev.target.value);
        },
        highlightWasClicked(place){
          this.$emit('clicked-highlight', place);
        },
        removeHighlightForAll(place){
          this.$emit('remove-highlight', place); 
        },
  },
};
</script>