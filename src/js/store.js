import { createStore } from 'vuex';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import config from "@/js/firebaseConfig.js";

const firebaseApp = initializeApp(config);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export default createStore({
  state: {
    user: null, // ---------------Firebase authenticated user
    authInitialized: false, //----------------Ensure auth is initialized before using
    center: { lat: 40.689247, lng: -74.044502 }, // Default center (Statue of Liberty)
    zoom: 15, // Default zoom level
    latestPlaceSearch: [],
    userMapMarkers: [],//in the shape of {long, lat, userTagFromGoogle}
    locationMapMarkers: [], //in the shape of {long, lat, {locationObject}}
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    user: (state) => state.user,
    center: (state) => state.center,
    zoom: (state) => state.zoom,
    latestPlaceSearch: (state) => state.latestPlaceSearch,
    locationMapMarkers: (state) => state.locationMapMarkers,
    userMapMarkers: (state) => state.userMapMarkers,
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
    CLEAR_MARKERS(state) {
      state.locationMapMarkers.forEach((marker) => {
        marker.setVisible(false);
        marker.setMap(null); // Remove the marker from the map
        marker = null;
      });
      state.locationMapMarkers = []; // Clear the array of markers
    },
  },
  actions: {
    async initializeAuth({ commit }) {
        // Set up Firebase auth state listener
        onAuthStateChanged(auth, (user) => {
          commit('SET_USER', user);
          commit('SET_AUTH_INITIALIZED', true); // Mark auth as initialized
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
    clearMarkers({ commit }) {
      commit('CLEAR_MARKERS');
    },
  },
  modules: {
    // You can define modules here for modular store management
  },
});