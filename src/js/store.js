import { createStore } from 'vuex';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";
import config from "@/js/firebaseConfig.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayRemove, 
  arrayUnion, 
  onSnapshot 
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import {groupSubscription, userSubscription, CLEAR_GROUP_MEMBER_MAP_MARKERS, throwManualPositionUpdatePopup, updateUserPositionInGroup, fetchDetailsForPlace, updateUserDocWithSavedGroup, throwRegularAlert, throwSavedGroupManagementPopup, dataSearchMapWithCurrentQuery, clearSearchMapMarkers, createUserDocIfNoneExists} from '@/js/Data.js';
import{polyline_store} from './polylinestore.js';
import { useRouter } from 'vue-router';

const firebaseApp = initializeApp(config);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export default createStore({
  state: {
    map: null, 
    user: null, 
    userCoords: {},
    authInitialized: false, 
    center: { lat: 40.689247, lng: -74.044502 },
    zoom: 15,
    latestPlaceSearch: [],
    locationMapMarkers: [], //in the shape of {long, lat, {locationObject}}
    highlightMapMarkers: [], //in the shape of {long, lat, {locationObject}}
    groupMemberMapMarkers: [], //in the shape of {long, lat, {locationObject}}
    groupHighlightedPlaces: [],
    //for sidebar groups
    groupName: '',
    groupKey: '',
    writtenGroupKey: '', //group key in sidebar - used for input field and translated to groupKey once we enter.
    groupMembers: [], 
    adminUid: null, 
    kickedMembers: [], 
    latestGroupDirectionSearch: [],// stored in the format: {uid: member.uid, directions: result}. result is built the same way the json response is.
    clickedMarkerPlace: null,
    highlightedPlace: null,
    groupUnsubscribe: null, //needed to save the unsubscribe function for the group listener!!
    userUnsubscribe: null,
    groupMidpoint: null,
    clickedMarkerDetails: null,
    latestDirectionSearch: null,
    groupDetailsOpen: false,
    currentMapSearchQuery: '',
    //new for group saving
    savedGroups: [], //of the structure {key: .... , name: ....}
  },
  getters: {
    groupName: (state) => state.groupName,
    userCoords: (state) => state.userCoords,
    groupDetailsOpen: (state) => state.groupDetailsOpen,//determines if user is currently looking at the group travel details after clicking in sidebar
    clickedMarkerDetails: (state) => state.clickedMarkerDetails, 
    savedGroups: (state) => state.savedGroups,//this one for groups from persistence
    isAuthenticated: (state) => !!state.user,
    user: (state) => state.user,
    center: (state) => state.center,
    zoom: (state) => state.zoom,
    latestPlaceSearch: (state) => state.latestPlaceSearch,
    latestDirectionSearch: (state) => state.latestDirectionSearch,
    latestGroupDirectionSearch: (state) => state.latestGroupDirectionSearch,
    locationMapMarkers: (state) => state.locationMapMarkers,
    map: (state) => state.map,
    clickedMarkerPlace: (state) => state.clickedMarkerPlace,
    highlightedPlace: (state) => state.highlightedPlace,
    groupKey: (state) => state.groupKey,
    writtenGroupKey: (state) => state.writtenGroupKey,
    groupMembers: (state) => state.groupMembers,
    adminUid: (state) => state.adminUid,
    kickedMembers: (state) => state.kickedMembers,
    groupMemberMapMarkers: (state) => state.groupMemberMapMarkers,
    groupMidpoint: (state) => state.groupMidpoint,
    groupHighlightedPlaces: (state) => state.groupHighlightedPlaces,
  },
  mutations: {
    HANDLE_MANUAL_POSITION_UPDATE(state){
      throwManualPositionUpdatePopup(state);
    },
    OPEN_MANAGE_SAVES_POPUP(state){
      throwSavedGroupManagementPopup(state, state.savedGroups);
    },
    SEARCH_MAP_WITH_CURRENT_QUERY(state){
      dataSearchMapWithCurrentQuery(state);
    },
    UPDATE_CURRENT_MAP_SEARCH_QUERY(state, value){
      state.currentMapSearchQuery = value;
      clearSearchMapMarkers(state);//this removes old map markers if you edit the search bar content
    },
    //FOR PROMPTING A GROUP NAME
    SET_GROUP_NAME_PROMPT_TRUE(state){
      state.promptGroupName = true;
      console.log("Prompt variable is now: ", state.promptGroupName);
    },
    GROUP_NAME_PROMPT_DONE(state, name){
      state.groupName = name;
    },
    SET_GROUPKEY_FROM_DROPDOWN(state, key){
        console.log("current written group key: ", state.writtenGroupKey);
        state.writtenGroupKey = key;
    },
    SET_USER(state, user) {
        state.user = user;
        createUserDocIfNoneExists(state);
        userSubscription(state);
        if(user == null){
          window.location.hash="#/main";
        }else{
          window.location.hash="#/map";
        }
    },
    SET_AUTH_INITIALIZED(state, initialized) {
        state.authInitialized = initialized;
    },
    SET_CENTER(state, newCenter) {
      state.center = newCenter;
    },
    SET_ZOOM(state, newZoom) {
      state.zoom = newZoom;
    },
    SET_LATEST_PLACE_SEARCH(state, results) {
      state.latestPlaceSearch = results;
      console.log('Updated model to : ', state.latestPlaceSearch);
    },
    ADD_LOCATION_MARKER(state, marker) {
      state.locationMapMarkers.push(marker);
    },
    
    CLEAR_MARKERS(state) {//bad name but this is only for locationMapMarkers yielded by a search in SearchBar.
      state.locationMapMarkers.forEach((marker) => {
        marker.setVisible(false);
        marker.setMap(null);
        marker = null;
      });
      state.locationMapMarkers = [];
    },

    SET_GROUP_KEY(state, key) {
        state.writtenGroupKey = key;
        console.log("MUTATIONupdates group key to: ", key);
    },

    SET_GROUP_MEMBERS(state, members){
      CLEAR_GROUP_MEMBER_MAP_MARKERS(state);
      state.groupMembers = members;
    },
    SET_KICKED_MEMBERS(state, members){
      state.kickedMembers = members;
    },
    SET_ADMIN_UID(state, id){
      state.adminUid = id;
    },
    SET_MAP(state, map) {
      state.map = map;
  },
  LEAVE_GROUP(state){
    state.groupKey = null;
    state.groupMembers = [];
    state.kickedMembers = [];
    state.adminUid = null;
    state.groupMidpoint = state.userCoords;
    CLEAR_GROUP_MEMBER_MAP_MARKERS(state);
  },
    UPDATE_USER_COORDS(state, coords){
      state.userCoords = coords;
      if(state.groupKey !== ''){ //if we are in a group
        console.log("Attempting to update position in group");
        updateUserPositionInGroup(state, coords);
      }
      if(state.groupMidpoint === null){
        state.groupMidpoint = coords;
      }
      console.log("updated user coords to: ", state.userCoords);
      throwRegularAlert("Located user", "We located you on the map! If your position is off you can update it manually from the navbar.", null);
    },

  SET_GROUP_UNSUBSCRIBE(state, unsubscribe) {
    state.groupUnsubscribe = unsubscribe;
  },
  CLEAR_GROUP_UNSUBSCRIBE(state) {
    if (state.groupUnsubscribe) {
      state.groupUnsubscribe(); //calling the subscription cancels it out!!!
      state.groupUnsubscribe = null; //clears the stored function
    }
  },

  GROUP_MEMBER_WAS_CLICKED(state, member){
    console.log(member);
    state.map.setCenter({ lat: member.coords.lat, lng: member.coords.lng });
  },

  async FIND_GROUP_DIRECTIONS(state, place) { // uses: clicked marker place clicked marker details
    state.map.setCenter({ lat: place.coords.lat, lng: place.coords.lng });
    console.log("Draw for group");
    state.clickedMarkerDetails = null;
    state.clickedMarkerPlace = place;
    fetchDetailsForPlace(state, place);//FETCHES MORE DETAILED INFORMATION ABOUT A PLACE
    try {
        if (!place || !place.place_id) {
            console.log("Didn't draw group polylines to destination. The place object is null.", place);
            return; // Exit the function if we're just resetting to null.
        }

        const { DirectionsService } = await google.maps.importLibrary("routes");
        const directionsService = new DirectionsService();
        let destinationCoordinates = { lat: place.coords.lat, lng: place.coords.lng };
        state.latestGroupDirectionSearch = []; //empty the array
        polyline_store.clearGroupLines();

        // Loop through each group member
        state.groupMembers.forEach((member) => {
          const request = {
              origin: new google.maps.LatLng(member.coords.lat, member.coords.lng),
              destination: new google.maps.LatLng(destinationCoordinates.lat, destinationCoordinates.lng),
              travelMode: google.maps.TravelMode.TRANSIT,
          };

          directionsService.route(request, (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                  console.log("Directions data for :", member, " is: ", result);
                  state.latestGroupDirectionSearch.push({uid: member.uid, directions: result});
                  const overviewPolyline = result.routes[0].overview_polyline;
                  const decodedPath = google.maps.geometry.encoding.decodePath(overviewPolyline);
                  const newPolyline = new google.maps.Polyline({
                      path: decodedPath,
                      strokeColor: polyline_store.getNewColour(),
                      strokeOpacity: 1.0,
                      strokeWeight: 2,
                      map: state.map,
                  });

                  newPolyline.addListener("click", () => {
                      console.log(`Polyline clicked: ${newPolyline}`);
                      console.log(`Coordinates: ${place.coords.lat}, ${place.coords.lng}`);
                  });

                  polyline_store.addGroupLine(newPolyline);
              } else {
                  console.error("Error fetching directions:", status);
              }
          });
      });
  } catch (error) {
      console.error("Error fetching directions:", error);
  }
  console.log("Search for directions for group gave: ", state.latestGroupDirectionSearch);
  state.groupDetailsOpen = true;
  },

  CLOSE_DETAILS_VIEW(state){
    state.clickedMarkerDetails = null;
    state.clickedMarkerPlace = null;
    state.groupDetailsOpen = false;
    polyline_store.clearUserLines();
    polyline_store.clearGroupLines();
  },

 async UPDATE_HIGHLIGHTED_PLACE(state, place) {
  state.clickedMarkerDetails = null;
  state.clickedMarkerPlace = place;
  fetchDetailsForPlace(state, place);//FETCHES MORE DETAILED INFORMATION ABOUT A PLACE
  //DRAWS POLYLINE
      try {
        if (!place || !place.place_id) {
          console.log("Didnt draw polyline to destination. The place object is null. ", place);
          return; // Exit the function if we're just resetting to null.
        }
        const { DirectionsService } = await google.maps.importLibrary("routes");
        const directionsService = new DirectionsService();

        let destinationCoordinates;
        if (place.coords) {
            destinationCoordinates = { lat: place.coords.lat, lng: place.coords.lng };
        } else {
            destinationCoordinates = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
        }

        const request = {
            origin: new google.maps.LatLng(state.userCoords.lat, state.userCoords.lng),
            destination: new google.maps.LatLng(destinationCoordinates.lat, destinationCoordinates.lng),
            travelMode: google.maps.TravelMode.TRANSIT,
        };

        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                console.log("Directions data:", result);
                state.latestDirectionSearch = result;

              const overviewPolyline = result.routes[0].overview_polyline;
              const decodedPath = google.maps.geometry.encoding.decodePath(overviewPolyline);
              const newPolyline = new google.maps.Polyline({
                  path: decodedPath,
                  strokeColor: "#FF0000",
                  strokeOpacity: 1.0,
                  strokeWeight: 2,
                  map: state.map,
                  
              });
              newPolyline.addListener("click", () => {
                console.log(`Polyline clicked: ${newPolyline}`);
                console.log(`Coordinates: ${place.geometry.location.lat()}, ${place.geometry.location.lng()}`);
              });

              polyline_store.clearUserLines();
              polyline_store.addUserLine(newPolyline);
            } else {
                console.error("Error fetching directions:", status);
            }
        });
    } catch (error) {
        console.error("Error fetching directions:", error);
    }
    //-----------------end of polyline code
  },

  async CREATE_NEW_GROUP(state, name){
    console.log("name sent to firebase is: ", name);
    state.groupName = name;

    if (!state.user || state.groupKey) {
      throwRegularAlert('Failed to create a group','Log in to create a group.', null);
      console.log("You need to be logged in to create a group. Or you cannot create a group while you have one active.");
      return;
    }
    const db = getFirestore();
    const newGroupKey = uuidv4();
    const groupRef = doc(db, "groups", newGroupKey);
  
    try {
      //gets user coordinates
      await setDoc(groupRef, {
        adminUid: state.user.uid,
        members: [
          {
            uid: state.user.uid,
            name: state.user.displayName,
            email: state.user.email,
            icon: state.user.photoURL,
            coords: state.userCoords
          }
        ],
        kickedMembers: [], 
        name: state.groupName,
      });
  
      const userRef = doc(db, "users", state.user.uid);
      await updateDoc(userRef, { groupKey: newGroupKey }); //add to personal list too
      state.groupKey = newGroupKey;
      state.adminUid = state.user.uid;
      
      //like comment subscribe
      groupSubscription(state);
      console.log(`Group created successfully! Share your key: ${newGroupKey}`);
      updateUserDocWithSavedGroup(state, newGroupKey);

    } catch (error) {
      console.error("Error creating group: ", error);
      throwRegularAlert('Failed to create group', 'An error occured while saving the group to the databse. Sorry for the inconvenience.', null);
      console.log("An error occurred while creating the group.");
    }
  },

  async HIGHLIGHT_PLACE_TO_GROUP(state, place){
    const db = getFirestore();
    const groupRef = doc(db, "groups", state.groupKey);
    try{
      const groupSnap = await getDoc(groupRef);
      if (!groupSnap.exists()) {
        console.log("The group does not exist.");
        return;
      }

      //here we first have to check that the place isnt already in the group.
      const groupData = groupSnap.data();
      const existingPlaces = groupData.places || [];
      //check if the place is already in the group based on formatted_address here
      const isPlaceAlreadyAdded = existingPlaces.some(
        (existingPlace) => existingPlace.formatted_address === place.formatted_address
      );
      if (isPlaceAlreadyAdded) {
        console.log("Place is already added to the group.");
        throwRegularAlert('Pin already added!', 'That pin has already been added by another group member.', null);
        return; //exit since the place is already present
      }

      const photoUrls = state.clickedMarkerDetails.photos && state.clickedMarkerDetails.photos.length > 0 //get the photos in a new array
      ? state.clickedMarkerDetails.photos.map(photo => photo.getUrl())  // Extracting URLs
      : ["https://via.placeholder.com/150"];  // Default if no photos

      const newPlace = {
        name: place.name || "N/A",
        formatted_address: state.clickedMarkerDetails.formatted_address || "N/A",
        international_phone_number: state.clickedMarkerDetails.international_phone_number || "N/A",
        opening_hours: state.clickedMarkerDetails.opening_hours ? state.clickedMarkerDetails.opening_hours.weekday_text : ["N/A"],
        rating: state.clickedMarkerDetails.rating || "N/A",
        price_level: state.clickedMarkerDetails.price_level !== undefined ? state.clickedMarkerDetails.price_level : "N/A",
        coords: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
        photos: photoUrls,
        icon: state.clickedMarkerDetails.icon || "N/A",
        place_id: place.place_id || "N/A",
        website: state.clickedMarkerDetails.website || "N/A"
      };

      await updateDoc(groupRef, {
        places: arrayUnion(newPlace),
      });

    }catch(error){
      throwRegularAlert('Error', 'An error occured while sending the pin information to your group. Sorry for the inconvenience.', null);
      console.log("Error pushing new place to persistence in group: ", error);
    }
  },

  async REMOVE_HIGHLIGHT_FROM_GROUP(state, place){
    const db = getFirestore();
    const groupRef = doc(db, "groups", state.groupKey);
    try {
      const groupSnap = await getDoc(groupRef);
      if (!groupSnap.exists()) {
        console.log("The group does not exist.");
        return;
      }
  
      const groupData = groupSnap.data();
      const existingPlaces = groupData.places || [];
      
      const placeToRemove = existingPlaces.find(
        (existingPlace) => existingPlace.formatted_address === place.formatted_address
      );
      
      if (!placeToRemove) {
        console.log("Place not found in the group.");
        return; //exit if the place is not found. could have been removed by another member before.
      }

      await updateDoc(groupRef, {
        places: arrayRemove(placeToRemove),
      });
  
      console.log("Place removed successfully from the group.");
    } catch (error) {
      console.log("Error removing place from the group: ", error);
    }
  },
  async LOAD_GROUP(state){
    const db = getFirestore();
    const userRef = doc(db, "users", state.user.uid);
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        state.groupKey = userData.groupKey || '';
        state.savedGroups = userData.savedGroups || []; //new for previous groups
        if (state.groupKey) {
          groupSubscription(state);
        }
      }
    } catch (error) {
      console.error("Error fetching user group: ", error);
    }
    
  },
  async CLEAR_PERSISTENCE_USER_GROUP(state) {
    const db = getFirestore();
    if (!state.groupKey) {
        console.log("Cannot clear user from group and user group key since group key is not currently set. This is normal if called when not currently inside a group.");
        return;
    }
    const userRef = doc(db, "users", state.user.uid);
    const groupRef = doc(db, "groups", state.groupKey);
    try {
        await updateDoc(userRef, { groupKey: '' });
        //have to remove group from savedGroups on this line too.
        const groupSnap = await getDoc(groupRef);
        if (!groupSnap.exists()) {
            console.error("The group does not exist.");
            return;
        }

        const groupData = groupSnap.data();
        const updatedMembers = groupData.members.filter(member => member.uid !== state.user.uid);

        await updateDoc(groupRef, {
            members: updatedMembers,
        });
        console.log("Successfully removed user from group members.");
    } catch (error) {
        console.error("Error clearing user group:", error);
    }
},
  async ATTEMPT_JOIN_GROUP(state){
    state.groupKey = state.writtenGroupKey;
    if (!state.user || !state.groupKey) {
      console.log("You need to be logged in and have a valid group key to join a group");
      throwRegularAlert('Could not join group', 'No key was entered into the Join Through Key-field. Please try again with an active key, or create your own group.', null);
      return;
    }

    const db = getFirestore();
    const groupRef = doc(db, "groups", state.groupKey);
    const userRef = doc(db, "users", state.user.uid);

    try{
      const groupSnap = await getDoc(groupRef);
      if (!groupSnap.exists()) {
        console.log("The group does not exist.");
        throwRegularAlert('Could not join group', 'The given group key is not connected to any active group. Verify the spelling.', null);
        return;
      }
      if(groupSnap.data().kickedMembers.includes(state.user.uid)){
        console.log("Could not join group. You've been kicked from this group before.");
        throwRegularAlert('Could not join group', 'You could not join the given group because youve been kicked from it before.', null);
        state.groupKey = '';
        return;
      }

      console.log("Group found. Attempting to join...");
      const newMember = {
        uid: state.user.uid,
        name: state.user.displayName,
        email: state.user.email,
        icon: state.user.photoURL,
        coords: state.userCoords,
      };

      await updateDoc(groupRef, {
        members: arrayUnion(newMember),
      });
      groupSubscription(state);
      console.log("Successfully joined the group!");
      await updateDoc(userRef, {
        groupKey: state.groupKey,
      });

      const newGroupKey = state.groupKey;
      updateUserDocWithSavedGroup(state, newGroupKey); //only updates if its new

    }catch(error){
      console.log("Error joining group: ", error);
    }
  },
    async KICK_MEMBER(state, member){
      state.kickedMembers.push(member);
      if (!state.user || !state.groupKey) {
        console.log("You need to be logged in and have a valid group key to kick a person from a group");
        return;
      }
      try{
          const db = getFirestore();
          const groupRef = doc(db, "groups", state.groupKey);
          const userRef = doc(db, "users", member.uid);
          const groupSnap = await getDoc(groupRef);
          if (!groupSnap.exists()) {
            console.error("The group does not exist.");
            return;
          }
          //gets the current members and filters out the user
          const groupData = groupSnap.data();
          const updatedMembers = groupData.members.filter(memberInP => memberInP.uid !== member.uid);
          const updatedKickedMembers = [...groupData.kickedMembers, member.uid];
          //update the group members array
          await updateDoc(groupRef, {
            members: updatedMembers,
            kickedMembers: updatedKickedMembers,
          });
          console.log("Successfully removed user from group members.");
          //lastly update the users own persistence groupKey
          await setDoc(userRef, { groupKey: '' });
      }catch(error){
        console.log("Error joining group: ", error);
      }
  },
  },//---------------------------------------- ACTIONS BEGIN HERE ----------------------------------------
  actions: {
    async initializeAuth({ commit }) {
        onAuthStateChanged(auth, async (user) => {
          commit('SET_USER', user);
          commit('SET_AUTH_INITIALIZED', true);
            if (user) {
                commit('LOAD_GROUP');
            }
        });
      },

    async login({ commit }) {
        try {
          const result = await signInWithPopup(auth, provider);
          commit('SET_USER', result.user);
          console.log("New user login for user : ", result.user)
        } catch (error) {
          console.error("Login error:", error);
        }
      },
      
    async logout({ commit }) {
        try {
          await signOut(auth);
          commit('SET_USER', null);
          commit('LEAVE_GROUP');
        } catch (error) {
          console.error("Logout error:", error);
        }
    },

    async unsubscribeFromGroup({ commit }) {
      commit('CLEAR_GROUP_UNSUBSCRIBE');
    },

    async createGroup({ commit }, name) {
      console.log("received name in actions in store: ", name);
      commit('GROUP_NAME_PROMPT_DONE', name);
      commit('CREATE_NEW_GROUP', name);
    },

    leaveGroup({commit}){
      console.log("Entered leave group in model");
      commit('CLEAR_GROUP_UNSUBSCRIBE');
      commit('SET_GROUP_MEMBERS', []);
      commit('SET_KICKED_MEMBERS', []);
      commit('SET_ADMIN_UID', null);
      commit('CLEAR_PERSISTENCE_USER_GROUP');
    },
    joinGroup({commit}){
      console.log("Entered join group in model");
      commit('ATTEMPT_JOIN_GROUP');
    },

    kickMember({commit}, member){
      console.log("Went to kick member in store.");
      commit('KICK_MEMBER', member);
    },

    updateLatestPlaceSearch({ commit }, results) {
      commit('SET_LATEST_PLACE_SEARCH', results);
    },
    updateGroupKey({commit}, key){
      console.log("ACTIONupdates group key to: ", key);
      commit('SET_GROUP_KEY', key);
    },
    initMap({ commit }, map) {
      commit('SET_MAP', map);
    },
    updateCenter({ commit }, newCenter) {
      commit('SET_CENTER', newCenter);
    },
    updateZoom({ commit }, newZoom) {
      commit('SET_ZOOM', newZoom);
    },
    addUserMarker({ commit }, marker) {
      commit('ADD_USER_MARKER', marker);
    },
    removeUserMarker({ commit }, marker) {
      commit('REMOVE_USER_MARKER', marker);
    },
    addLocationMarker({ commit }, marker) {
      commit('ADD_LOCATION_MARKER', marker);
    },
    async userInterestedInLocation({ commit }, place) {//TEST ASYNC
      console.log("Clicked pin");
      commit('UPDATE_HIGHLIGHTED_PLACE', place);
    },
    userClosesDetails({ commit }) {//TEST ASYNC
      console.log("Closing details");
      commit('CLOSE_DETAILS_VIEW');
    },
    addPolyline({commit}, place){
      commit('ADD_USER_POLYLINE');
    },
    removePolyline({commit}, place) {
      commit('REMOVE_USER_POLYLINE');
    },
    async userClickedGroupHighlightFromSidebar({commit}, place){
      commit('FIND_GROUP_DIRECTIONS', place);
    },
    removeMapHighlightFromGroup({ commit }, place) {
      commit('REMOVE_HIGHLIGHT_FROM_GROUP', place);
    },
    userLikedHighlightedLocation({ commit }, place) {
      commit('HIGHLIGHT_PLACE_TO_GROUP', place);
    },
    groupMemberWasClicked({commit}, member){
      commit('GROUP_MEMBER_WAS_CLICKED', member)
    },
    clearMarkers({ commit }) {
      commit('CLEAR_MARKERS');
    },
    updateUserCoords({commit}, coords){
      commit('UPDATE_USER_COORDS', coords);
    },
    dropdownKeyChange({commit}, key){
      commit('SET_GROUPKEY_FROM_DROPDOWN', key);
    },
    //for prompting a group name
    promptUserForName({commit}){
      commit('SET_GROUP_NAME_PROMPT_TRUE');
    },
    removePromptForName({commit}, name){
      commit('GROUP_NAME_PROMPT_DONE', name);
    },
    manageSaves({commit}){
      commit('OPEN_MANAGE_SAVES_POPUP');
    },
    searchMapWithCurrentQuery({commit}){
      commit('SEARCH_MAP_WITH_CURRENT_QUERY');
    },
    updateCurrentMapSearchQuery({commit}, value){
      commit('UPDATE_CURRENT_MAP_SEARCH_QUERY', value);
    },
    handleManualPositionUpdate({commit}){
      commit('HANDLE_MANUAL_POSITION_UPDATE');
      console.log("made it to store from handlee manual position update");
    },
  },
  modules: {
  },
});