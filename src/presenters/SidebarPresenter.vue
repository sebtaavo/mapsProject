<template>
    <Sidebar
      :user="user"
      :groupMembers="groupMembers"
      :adminUid="adminUid"
      :categories="categories"
      @join-group="handleJoinGroup"
      @leave-group="handleLeaveGroup"
      @kick-member="handleKickMember"
      @create-group="handleCreateGroup"
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
      ...mapState(['user', 'groupMembers', 'adminUid']),
    },
    methods: {//THINGS WE NEED TO BE ABLE TO TELL THE MODEL TO DO GO HERE.
      ...mapActions(['joinGroup', 'leaveGroup', 'kickMember', 'fetchGroupData', 'createGroup']),//DEFINED ACTIONS FROM THE MODEL. CALLED WITH "THIS."
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
      handleCreateGroup(member) {
        this.createGroup().catch((error) => {
          console.error("Group creation error: ", error.message);
        });
      },
    },
  };
  </script>
  