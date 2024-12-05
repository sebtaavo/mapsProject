<template>
<div class="sidebar">
    <div class="group-members-title">
        Group Members
    </div>
    <div class="group-members"><!-- group members section -->
        <div v-if="user" class = "member-item">
            
        </div>
        <li
          v-for="(member) in [user, ...groupMembers]"
          :key="member.uid"
          class="member-item"
        >
          <img :src="member.icon || null" class="member-icon" alt="User Icon" @click="handleMemberWasClicked(member)"/>
          {{ member.name }}
          <span v-if="member.uid === adminUid" class="admin-label">(Owner)</span>
          <button
            v-if="user.uid === adminUid && member.uid !== adminUid"
            class="kick-button"
            @click="handleKickMember(member)"
          >
            Remove
          </button>
        </li>
    </div><!-- end of div showing group members -->

    <div><!--  -->

    </div>
</div>
</template>


<script>
export default {
    props: {
        user: {
        type: Object,
        required: true, 
        },
        groupMembers: {
        type: Array,
        required: true,
        },
        adminUid: {
        type: String,
        required: true,
        },
        groupKey: {
        type: String,
        required: true,
        },
        kickedMembers: {
        type: Array,
        required: true,
        }
    },
    methods: {
        handleJoinGroup(key) {
            this.$emit('join-group', key); // Emit the event to parent component
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
  },
}
</script>