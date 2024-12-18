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
      :groupHighlightedPlaces="groupHighlightedPlaces"
      :savedGroups="savedGroups"
      :userCoordsEmpty = "userCoordsEmpty"
      :groupName = "groupName"
      @join-group="handleJoinGroup"
      @leave-group="handleLeaveGroup"
      @kick-member="handleKickMember"
      @create-group="handleRequestGroupPopup"
      @actually-create-group="handleCreateGroup"
      @close-prompt="handleClosePrompt"
      @clicked-member="handleClickedMember"
      @keyupdate="handleUpdateGroupKey"
      @clicked-highlight="handleClickedHighlight"
      @remove-highlight="handleRemoveHighlight"
      @groupselected="handleDropDownGroupKey"
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
        savedGroups() {
          return this.$store.getters.savedGroups || [];
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
        groupHighlightedPlaces(){
          return this.$store.getters.groupHighlightedPlaces || [];
        },
        userCoordsEmpty() {
          if(this.$store.getters.userCoords === null ||this.$store.getters.userCoords === undefined){
            return true;
          }
          return Object.keys(this.$store.getters.userCoords).length === 0 && this.$store.getters.userCoords.constructor === Object;
        },
        groupName(){
          return this.$store.getters.groupName || '';
        },
    },
    methods: {
      handleClosePrompt(){
        console.log("Closed the prompt wihout giving a name. No group was created.");
      },
      handleRequestGroupPopup(){
        console.log("Requested to create a group in sidebar. Sending request for a prompt to model.");
        this.$store.dispatch("promptUserForName");
      },
      handleDropDownGroupKey(key){
        console.log("Dropdown menu key chosen!");
        this.$store.dispatch("dropdownKeyChange", key);
      },
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
      handleCreateGroup(name) {
        console.log('Received order to create group in presenter for name: ', name);
        this.$store.dispatch("createGroup", name); 
      },
      handleClickedMember(member) {
        console.log('Received order to zoom in on member in presenter.');
        this.$store.dispatch("groupMemberWasClicked", member); 
      },
      handleUpdateGroupKey(key) {
        console.log('Received order in presenter to update group key to ', key);
        this.$store.dispatch("updateGroupKey", key); 
      },
      handleClickedHighlight(place){
        console.log("Received order to open details from highlight pin text in sidebar for place: ", place);
        this.$store.dispatch('userClickedGroupHighlightFromSidebar', place);
      },
      handleRemoveHighlight(place){
        console.log("Received order to remove highlight pin for all group members in persistence! For place: ", place);
        this.$store.dispatch('removeMapHighlightFromGroup', place);
      }, 
    },
  };
  </script>
