import { createStore } from 'vuex';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";
import config from "@/js/firebaseConfig.js";

const firebaseApp = initializeApp(config);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export default createStore({
  state: {
    map: null, //--map object passed from googlemap obejct in Map.vue
    user: null, // ---------------Firebase authenticated user
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
    highlightedPlace: null
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
    },
    SET_MAP(state, map) {
      state.map = map;
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
  },
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

    updateLatestPlaceSearch({ commit }, results) {
      commit('SET_LATEST_PLACE_SEARCH', results);
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

    clearMarkers({ commit }) {
      commit('CLEAR_MARKERS');
    },
  },
  modules: {
    // You can define modules here for modular store management
  },
});