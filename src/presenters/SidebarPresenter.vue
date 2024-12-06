<template>
  <div>
    <SidebarTest
      :user="user"
      :groupMembers="groupMembers"
      :adminUid="adminUid"
      :groupKey = "groupKey"
      :writtenGroupKey = "writtenGroupKey"
      :kickedMembers = "kickedMembers"
      :place = "detailsPlace"
      @join-group="handleJoinGroup"
      @leave-group="handleLeaveGroup"
      @kick-member="handleKickMember"
      @create-group="handleCreateGroup"
      @clicked-member="handleClickedMember"
      @keyupdate="handleUpdateGroupKey"  
    />
  </div>
  </template>
  
  <script>
  //in the code above, the :user = "user" means that the sidebar will have its "user" property set to the "user" from the model, as seen in "computed" in the export default below.
  //same for @join-group = "handleJoinGroup", which means that if the Sidebar "emits" the action join-group, then we call the method list below in methods:
  

  import SidebarTest from '@/components/SidebarTest.vue';
  
  export default {
    name: "SidebarPresenter",
    components: {
      SidebarTest,
    },

    mounted() {
        console.log("SidebarPresenter mounted");
    },
    computed:{
        user() {
          return this.$store.getters.user || null;
        },
        groupMembers() {
          console.log(this.$store.getters.groupMembers);
          return this.$store.getters.groupMembers || [];
        },
        adminUid() {
          return this.$store.getters.adminUid || '';
        },
        groupKey() {
          return this.$store.getters.groupKey || '';
        },
        writtenGroupKey() {
          return this.$store.getters.writtenGroupKey || '';
        },
        kickedMembers() {
          return this.$store.getters.kickedMembers || [];
        },
        detailsPlace(){
          return this.$store.getters.clickedMarkerPlace || null;
        },
    },
    methods: {
      handleJoinGroup() {
        console.log('Received order to join group in presenter.');
        this.$store.dispatch("joinGroup");
      },
      handleLeaveGroup() {
        console.log('Received order to leave group in presenter.');
        this.$store.dispatch("leaveGroup"); 
      },
      handleKickMember(member) {
        console.log('Received order to kick member in presenter.');
        this.$store.dispatch("kickMember", member); //implement this in store first
      },
      handleCreateGroup() {
        console.log('Received order to create group in presenter.');
        this.$store.dispatch("createGroup"); 
      },
      handleClickedMember(member) {
        console.log('Received order to zoom in on member in presenter.');
        this.$store.dispatch("groupMemberWasClicked", member); 
      },
      handleUpdateGroupKey(key) {
        console.log('Received order in presenter to update group key to ', key);
        this.$store.dispatch("updateGroupKey", key); 
      },
      
    },
  };
  </script>
  