<template>
  <div class="sidebar" v-if="!place && !userCoordsEmpty">
    <div class="group-members" v-if="groupMembers">
      <h2 class="heading" v-if="groupMembers.length > 0">Group Members</h2>
      <ul class="member-list">
        <li v-if="!user" class="member-item">
          <br>Please log in to use the app.
        </li>
        <li v-else-if="groupMembers.length === 0" class="member-item-title">
         <br> Join or create a group to get started!
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

    <div v-if="savedGroups.length && !groupMembers.length" class="dropdown-container">
      <label for="saved-group-select">Previous groups:</label>
      <select id="saved-group-select" @change="handleGroupSelect" class="dropdown">
        <option value="">-- Select a Previous Group --</option>
        <option
          v-for="group in savedGroups"
          :key="group.key"
          :value="group.key"
        >
          {{ group.name }}
        </option>
      </select>
    </div>

    <div 
  class="join-input-container" 
  :class="{ 'in-group': groupMembers.length > 0, 'no-saved-groups': savedGroups.length === 0 }"
>
  <div class="join-input-wrapper">
    <input
      type="text"
      :value="groupMembers.length ? groupKey : writtenGroupKey"
      placeholder="Join Through Key"
      class="join-input"
      id="join-input"
      @keyup.enter="handleJoinGroup"
      @input="handleUpdateGroupKey"
      :disabled="groupMembers.length !== 0"
    />
    <button 
      v-if="groupMembers.length === 0" 
      class="enter-group-button" 
      @click="handleJoinGroup"
    >
      Enter
    </button>
  </div>
  <button 
    v-if="groupMembers.length" 
    class="copy-group-key-button" 
    :class="{ 'move-up': groupMembers.length > 0 }"
    @click="copyGroupKey"
  >
    Copy Group Key
  </button>
</div>

<div 
  v-if="user && !groupMembers.length" 
  class="create-group-container" 
  :class="{ 'no-saved-groups': savedGroups.length === 0 }"
>
  <button class="create-group-button" @click="handleRequestCreateGroup">
    Create Your Own Group
  </button>
</div>


    <span class="group-pins-heading" v-if="groupMembers.length > 0">Group pins & travel info</span>
    <div class="group-pins-text" v-if="!(groupHighlightedPlaces.length > 0) && groupMembers.length > 0"><!--this div is only shown if we dont have any pins yet-->
      Locations pinned by your group goes here! Use the search bar on the map and click on the markers to start exploring!<br><br>
      If you are in a group, the 'Pin me' button in the details window of the place you've opened will cause for the pin to appear for the entire group!<br><br>
      Clicking the pinned location in the sidebar will give you travel information for all group members.
    </div>

    <div
      class="highlighted-places"
      style="cursor: pointer; user-select: none;"
      v-if="groupHighlightedPlaces.length > 0"
    >
      <div 
        v-for="(place, index) in groupHighlightedPlaces" 
        :key="index" 
        class="place-row"
      >
        <img 
          :src="place.icon" 
          alt="Place Icon" 
          class="place-icon" 
          @click="highlightWasClicked(groupHighlightedPlaces[index])"
        />
        <span 
          class="place-name" 

          @click="highlightWasClicked(groupHighlightedPlaces[index])"
        >
          {{ place.name }}
        </span>
        <button class="remove-button" @click="removeHighlightForAll(groupHighlightedPlaces[index])">
          ✖
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { throwMessageAlert } from '../js/Data';
export default {
  name: 'SidebarTest',
  data() {
    return {
      grpNum: 0,
    };
  },
  mounted() {},
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
    savedGroups: {
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
    groupHighlightedPlaces: {
      type: Array,
    },
    userCoordsEmpty:{
      type: Boolean,
    },
  },
  methods: {
    handleGroupSelect(event) {
      console.log("Entered dropdown event receiver with value: ", event.target.value);
      const selectedKey = event.target.value;
      if (selectedKey) {
        this.$emit('groupselected', selectedKey);
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

      Swal.fire({
        title: 'Choose a group name',
        text: 'The invite key is generated separately after this step. Copy and send the key to your friends!',
        input: 'text',
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
          popup: 'custom-dialog-popup',
          title: 'custom-dialog-title',
          input: 'custom-dialog-input',
          confirmButton: 'custom-confirm-btn',
          cancelButton: 'custom-cancel-btn'
        },
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('OK clicked:', result.value);
          this.$emit('actually-create-group', result.value || 'Default Group Name');
        } else if (result.isDismissed) {
          console.log('User canceled or closed the dialog');
        }
      });
    },
    handleMemberWasClicked(member) {
      this.$emit('clicked-member', member);
    },
    handleUpdateGroupKey(ev) {
      console.log("Input event: ", ev);
      console.log("Input event target value: ", ev.target.value);
      this.$emit('keyupdate', ev.target.value);
    },
    highlightWasClicked(place) {
      this.$emit('clicked-highlight', place);
    },
    removeHighlightForAll(place) {
      this.$emit('remove-highlight', place);
    },
    copyGroupKey() {
      if (this.groupKey) {
        navigator.clipboard.writeText(this.groupKey)
          .then(() => {
            throwMessageAlert("Copied group key", 1000);
          })
          .catch((err) => {
            console.error('Failed to copy group key:', err);
          });
      }
    },
  },
};
</script>


