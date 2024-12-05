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

const firebaseApp = initializeApp(config);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export default createStore({
  state: {
    map: null, //--map object passed from googlemap obejct in Map.vue
    user: null, // ---------------Firebase authenticated user
    userCoords: {},
    authInitialized: false, //----------------Ensure auth is initialized before using
    center: { lat: 40.689247, lng: -74.044502 }, // Default center (Statue of Liberty)
    zoom: 15, // Default zoom level
    latestPlaceSearch: [],
    userMapMarkers: [],//in the shape of {long, lat, userTagFromGoogle}
    locationMapMarkers: [], //in the shape of {long, lat, {locationObject}}
    highlightMapMarkers: [], //in the shape of {long, lat, {locationObject}}
    //for sidebar groups
    groupKey: '', // Group key input by the user
    groupMembers: [], // List of members in the group
    adminUid: '', // Admin UID for the current group
    kickedMembers: [], // List of kicked members for the current group
    clickedMarkerPlace: null,
    highlightedPlace: null,
    groupUnsubscribe: null, //needed to save the unsubscribe function for the group listener!!
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    user: (state) => state.user,
    center: (state) => state.center,
    zoom: (state) => state.zoom,
    latestPlaceSearch: (state) => state.latestPlaceSearch,
    locationMapMarkers: (state) => state.locationMapMarkers,
    userMapMarkers: (state) => state.userMapMarkers,
    map: (state) => state.map,
    clickedMarkerPlace: (state) => state.clickedMarkerPlace,
    highlightedPlace: (state) => state.highlightedPlace,
    groupKey: (state) => state.groupKey,
    groupMembers: (state) => state.groupMembers,
    groupAdminUid: (state) => state.adminUid,
    kickedMembers: (state) => state.kickedMembers,
  },
  mutations: {
    SET_USER(state, user) {
        state.user = user;
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
    ADD_USER_MARKER(state, marker) {
      state.userMapMarkers.push(marker);
    },
    REMOVE_USER_MARKER(state, marker) {
      const index = state.userMapMarkers.indexOf(marker);
      if (index !== -1) {
        state.userMapMarkers.splice(index, 1);
      }
    },
    ADD_LOCATION_MARKER(state, marker) {
      state.locationMapMarkers.push(marker);
    },
    CLEAR_MARKERS(state) {//bad name but this is only for locationMapMarkers yielded by a search in SearchBar.
      state.locationMapMarkers.forEach((marker) => {
        marker.setVisible(false);
        marker.setMap(null); // Remove the marker from the map
        marker = null;
      });
      state.locationMapMarkers = []; // Clear the array of markers
    },
    SET_GROUP_KEY(state, key) {
        state.groupKey = key;
        console.log("MUTATIONupdates group key to: ", key);
    },

    SET_GROUP_MEMBERS(state, members){
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
  },
    UPDATE_USER_COORDS(state, coords){
      state.userCoords = coords;
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
    state.map.setCenter({ lat: member.coords.lat, lng: member.coords.lng });
  },

  UPDATE_HIGHLIGHTED_PLACE(state, place) {
    state.clickedMarkerPlace = place;
  },
  USER_LIKED_HIGHLIGHTED_PLACE(state, place) {
    state.clickedMarkerPlace = place;
    const mapMarker = new google.maps.Marker({
      map: state.map,
      position: place.geometry.location,
      title: place.name,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Google predefined blue pin
        scaledSize: new google.maps.Size(32, 32), // Resize if necessary
        anchor: new google.maps.Point(16, 32),  // Adjust anchor point
      }
    });
    //this is what registers a click on this specific marker on the map.
    mapMarker.addListener("click", () => {
      console.log(`Clicked highlight marker: ${place.name}`);
      console.log(`Coordinates: ${place.geometry.location.lat()}, ${place.geometry.location.lng()}`);
      state.clickedMarkerPlace = place;
    });

    state.highlightMapMarkers.push(mapMarker);
  },
  async CREATE_NEW_GROUP(state){
    if (!state.user || state.groupKey) {
      console.log("You need to be logged in to create a group. Or you cannot create a group while you have one active.");
      return;
    }
    const db = getFirestore();
    const newGroupKey = uuidv4();
    const groupRef = doc(db, "groups", newGroupKey);
  
    try {
      // Get user coordinates
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
        kickedMembers: [] // Initialize kicked members list
      });//IF YOU WANT TO ADD MORE INFO TO THE GROUP YOU DO IT HERE.
  
      const userRef = doc(db, "users", state.user.uid);
      await setDoc(userRef, { groupKey: newGroupKey });
      state.groupKey = newGroupKey;
      state.adminUid = state.user.uid;
      
      //LIKE COMMENT SUBSCRIBE
      // Unsubscribe from the current group if already subscribed
      if (state.groupUnsubscribe) {
        state.groupUnsubscribe(); //calling the subscription cancels it out!!!
        state.groupUnsubscribe = null; //clears the stored function
      }
      //reference to the group document in Firestore
      const groupDocRef = doc(db, "groups", state.groupKey);
      //set up Firestore listener
      const subscription = onSnapshot(groupDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const groupData = docSnapshot.data();
          state.groupMembers = groupData.groupMembers || [];
          state.kickedMembers = groupData.kickedMembers || [];
          state.adminUid = groupData.adminUid || '';
          console.log("Fetched data from persisted model! in subscribeToGroup.")
        } else {
          console.error("Group document does not exist!");
        }
      }, (error) => {
        console.error("Error subscribing to group:", error);
      });

      state.groupUnsubscribe = subscription;
      console.log(`Group created successfully! Share your key: ${newGroupKey}`);
    } catch (error) {
      console.error("Error creating group: ", error);
      console.log("An error occurred while creating the group.");
    }
  },
  },//------------------------------------------------------------------- ACTIONS BEGIN HERE ----------------------------------------
  actions: {
    async initializeAuth({ commit }) {
        // Set up Firebase auth state listener
        onAuthStateChanged(auth, async (user) => {
          commit('SET_USER', user);
          commit('SET_AUTH_INITIALIZED', true); // Mark auth as initialized
           // If the user is authenticated, load user-specific data from Firestore
            if (user) {
                //pass
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
        } catch (error) {
          console.error("Logout error:", error);
        }
    },

    async unsubscribeFromGroup({ commit }) {
      commit('CLEAR_GROUP_UNSUBSCRIBE');
    },

    async createGroup({ commit }) {
      commit('CREATE_NEW_GROUP');
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
    userInterestedInLocation({ commit }, place) {
      commit('UPDATE_HIGHLIGHTED_PLACE', place);
    },
    userLikedHighlightedLocation({ commit }, place) {
      commit('USER_LIKED_HIGHLIGHTED_PLACE', place);
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
  },
  modules: {
    // You can define modules here for modular store management
  },
});