<template>
    <Sidebar
      :user="user"
      :groupMembers="groupMembers"
      :adminUid="groupAdminUid"
      :groupKey = "groupKey"
      :kickedMembers = "kickedMembers"
      @join-group="handleJoinGroup"
      @leave-group="handleLeaveGroup"
      @kick-member="handleKickMember"
      @create-group="handleCreateGroup"
      @clicked-member="handleMemberWasClicked"
    />
  </template>
  
  <script>
  //in the code above, the :user = "user" means that the sidebar will have its "user" property set to the "user" from the model, as seen in "computed" in the export default below.
  //same for @join-group = "handleJoinGroup", which means that if the Sidebar "emits" the action join-group, then we call the method list below in methods:
  
  import { mapState, mapActions } from 'vuex';
  import Sidebar from '@/components/Sidebar.vue';
  
  export default {
    name: "SidebarPresenter",
    components: Sidebar,
    computed: {//THINGS WE NEED FROM THE MODEL GO HERE.
      ...mapState(['user', 'groupMembers', 'groupKey', 'groupAdminUid', 'kickedMembers']),
    },
    methods: {
      ...mapActions(['joinGroup', 'leaveGroup', 'kickMember', 'fetchGroupData', 'createGroup', 'groupMemberWasClicked']),//DEFINED ACTIONS FROM THE MODEL. CALLED WITH "THIS."
      handleJoinGroup(groupKey) {
        this.joinGroup({ user: this.user, groupKey }).catch((error) => {
          console.error("Join group error:", error.message);
        });
      },
      handleLeaveGroup() {
        this.leaveGroup(this.user).catch((error) => {
          console.error("Leave group error:", error.message);
        });
      },
      handleKickMember(member) {
        this.kickMember(member).catch((error) => {
          console.error("Kick member error:", error.message);
        });
      },
      handleCreateGroup() {
        this.createGroup(this.user).catch((error) => {
          console.error("Group creation error: ", error.message);
        });
      },
      handleMemberWasClicked(member) {
        this.groupMemberWasClicked(member).catch((error) => {
          console.error("Error when handling click on group member: ", error.message);
        });
      },
    },
  };
  </script>
  