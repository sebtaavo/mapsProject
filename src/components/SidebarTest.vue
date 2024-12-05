<template>
    <div class="sidebar">
      <div class="group-members" v-if="groupMembers">
        <h2 class="heading">Group Members</h2>
        <ul class="member-list" >
          <li v-if="!user" class="member-item">
            Please log in to join a group.
          </li>
          <li v-else-if="groupMembers.length === 0" class="member-item">
            Join a group to see group members.
          </li>
          <li
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
          placeholder="Join Through Key"
          class="join-input"
          id="join-input"
          @keyup.enter="handleJoinGroup"
          @input="handleUpdateGroupKey"
        />
      </div>
  
      <div v-if="user && !groupKey" class="create-group-container">
        <button class="create-group-button" @click="handleCreateGroup">
          Create Your Own Group
        </button>
      </div>
    </div>
  </template>


<script>
export default {
  name:'SidebarTest',
  mounted() {
        this.$emit('reload', member); // Emit the event to parent with the member ID
    },
    props: {
        user: {
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
        kickedMembers: {
        type: Array,
        }
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
        }
  },
};
</script>