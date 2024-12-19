import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayRemove, 
  arrayUnion, 
  onSnapshot 
} from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import{polyline_store} from './polylinestore.js';
import store from './store.js';

export function groupSubscription(state){
      const db = getFirestore();
      if (state.groupUnsubscribe) {
        state.groupUnsubscribe(); //calling the subscription cancels it out!!!
        state.groupUnsubscribe = null; //clears the stored function
      }
      //reference to the group document in Firestore
      if (!state.groupKey) {
        console.error("Cannot subscribe to group: groupKey is missing or invalid.");
        return;
    }
      const groupDocRef = doc(db, "groups", state.groupKey);
      //set up Firestore listener
      const subscription = onSnapshot(groupDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const groupData = docSnapshot.data();
          state.groupName = groupData.name || '';
          state.groupMembers = groupData.members || [];
          state.kickedMembers = groupData.kickedMembers || [];
          state.adminUid = groupData.adminUid || '';
          state.groupMidpoint = calculateGeographicalMidpoint(state.groupMembers);
          state.groupHighlightedPlaces = groupData.places || [];
          console.log("group mid point is: ", state.groupMidpoint);
          //render the group members on the map
          CLEAR_GROUP_MEMBER_MAP_MARKERS(state);
          RENDER_GROUP_MEMBER_MARKERS_ON_MAP(state);
          //render the highlight pins set by group members and self on the map
          CLEAR_GROUP_HIGHLIGHT_MARKERS_ON_MAP(state);
          RENDER_GROUP_HIGHLIGHT_MARKERS_ON_MAP(state);
          console.log("Fetched data from persisted model! in subscribeToGroup.")
        } else {
          console.error("Group document does not exist!");
        }
      }, (error) => {
        console.error("Error subscribing to group:", error);
      });

      state.groupUnsubscribe = subscription;
};

//test section
export function RENDER_GROUP_MEMBER_MARKERS_ON_MAP(state){
  state.groupMembers.forEach((member) => {
    const mapMarker = new google.maps.Marker({
      map: state.map,
      position: member.coords,
      title: member.name,
      icon: {
        url: member.icon,
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32),
      }
    });
    state.groupMemberMapMarkers.push(mapMarker);
  });
    
};

export function CLEAR_GROUP_MEMBER_MAP_MARKERS(state) {//bad name but this is only for locationMapMarkers yielded by a search in SearchBar.
  state.groupMemberMapMarkers.forEach((marker) => {
    marker.setVisible(false);
    marker.setMap(null);
    marker = null;
  });
  state.groupMemberMapMarkers = []; 
};
//here for highlight pins
export async function RENDER_GROUP_HIGHLIGHT_MARKERS_ON_MAP(state){
  const { DirectionsService } = await google.maps.importLibrary("routes");
  const directionsService = new DirectionsService();
  state.groupHighlightedPlaces.forEach((place) => {
    const mapMarker = new google.maps.Marker({
      map: state.map,
      position: place.coords,
      title: place.name,
      icon: {
        url: "https://www.iconpacks.net/icons/2/free-location-pin-icon-2965-thumb.png",
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32), 
      }
    });
    mapMarker.addListener("click", () => {
      console.log(`Clicked highlight marker: ${place.name}`);
      console.log("Clicked highlight marker for place", place);
      console.log(`Coordinates: ${place.coords.lat}, ${place.coords.lng}`);
      if(!state.groupDetailsOpen){
        place._addedFromPersistence = true;
        state.clickedMarkerDetails = place;
        state.clickedMarkerPlace = place;
        state.groupDetailsOpen = false;
        //draw polyline
        //DRAWS POLYLINE
        try {
          if (!place || !place.place_id) {
            console.log("Didnt draw polyline to destination. The place object is null. ", place);
            return; // Exit the function if we're just resetting to null.
          }
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
                  console.log(`Coordinates: ${place.coords.lat}, ${place.coords.lng}`);
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
        //
  
      }
    });
    state.highlightMapMarkers.push(mapMarker);
  });
};
export function CLEAR_GROUP_HIGHLIGHT_MARKERS_ON_MAP(state) {
  state.highlightMapMarkers.forEach((marker) => {
    marker.setVisible(false);
    marker.setMap(null); 
    marker = null;
  });
  state.highlightMapMarkers = [];
};

export async function updateUserDocWithSavedGroup(state, newGroupKey){
        const db = getFirestore();
        const userRef = doc(db, "users", state.user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (!Array.isArray(userData.savedGroups)) {
              await setDoc(userRef, { savedGroups: [] }, { merge: true }); //
              userData.savedGroups = [];
         }
            //add group to previous groups if its not already there
            
            if (!userData.savedGroups.some((group) => group.key === newGroupKey)) {
              await updateDoc(userRef, {
                  savedGroups: arrayUnion({ name: state.groupName, key: newGroupKey }),
              });
          } else {
              console.log("Group key already exists in savedGroups");
          }
        } else {
            console.error("User document does not exist.");
        }
};

export async function removeSavedGroupFromUserDoc(state, thisKey) {
  const db = getFirestore();
  const userRef = doc(db, "users", state.user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("When removing previous group, found data: ", userData);
      if (Array.isArray(userData.savedGroups)) {
          // Filter out the group with the matching key
          const updatedGroups = userData.savedGroups.filter((group) => group.key !== thisKey);
          await updateDoc(userRef, {
              savedGroups: updatedGroups
          });
      } else {
          console.error("savedGroups is not an array in the user document.");
      }
  } else {
      console.error("User document does not exist.");
  }
}

export function userSubscription(state){
  const db = getFirestore();
  if (state.userUnsubscribe) {
    state.userUnsubscribe(); //calling the subscription cancels it out!!!
    state.userUnsubscribe = null; //clears the stored function
  }
  //reference to the group document in Firestore
  if (!state.user) {
    console.log("Could not subscribe to user on launch: user uid is missing or invalid. Probably not logged in.");
    return;
  }
  const userDocRef = doc(db, "users", state.user.uid);
  //set up Firestore listener
  const subscription = onSnapshot(userDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      console.log("User data as we fetch: ", userData);
      state.groupKey = userData.groupKey || '';
      state.savedGroups = userData.savedGroups || [];

      if(state.groupKey === ''){//happens if we were kicked , consider removing savedGroups from here.
        if(state.groupUnsubscribe){
          state.groupUnsubscribe();
          throwRegularAlert('Left group', 'You have been removed from the group.', null);
        }

        state.groupMembers = [];
        state.kickedMembers = [];
        state.adminUid = null;
        state.writtenGroupKey = '';
        state.groupMidpoint = state.userCoords;
        state.groupHighlightedPlaces = [];
        console.log("Check for user data: ", userData);
        CLEAR_GROUP_HIGHLIGHT_MARKERS_ON_MAP(state);
        CLEAR_GROUP_MEMBER_MAP_MARKERS(state);
      }
      console.log("Fetched USER data from persisted model!")
    } else {
      console.error("User document does not exist!");
    }
  }, (error) => {
    console.error("Error subscribing to group:", error);
  });

  state.userUnsubscribe = subscription;
};

function calculateGeographicalMidpoint(members) {
  if (!members.length) {
    throw new Error("Members array is empty");
  }

  let x = 0, y = 0, z = 0;

  members.forEach(({ coords: { lat, lng } }) => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;

    x += Math.cos(latRad) * Math.cos(lngRad);
    y += Math.cos(latRad) * Math.sin(lngRad);
    z += Math.sin(latRad);
  });

  const total = members.length;

  x /= total;
  y /= total;
  z /= total;

  const hyp = Math.sqrt(x * x + y * y);

  const midpointLat = Math.atan2(z, hyp) * (180 / Math.PI);
  const midpointLng = Math.atan2(y, x) * (180 / Math.PI); 
  return { lat: midpointLat, lng: midpointLng };
};

export async function fetchDetailsForPlace(state, place){
  try {
    if (!place || !place.place_id) {
      console.log("Didnt fetch place details. The place object is missing a valid place_id, or you closed the details window:", place);
      return; // Exit the function if place_id is not available
    }
       const { PlacesService } = await google.maps.importLibrary("places");
      // Initialize the PlacesService instance
      const service = new PlacesService(state.map); // Use the map passed as a prop
      // Define the getDetails request
      const detailsRequest = {
        placeId: place.place_id,
        fields: [
          "name",
          "geometry",
          "formatted_address",
          "international_phone_number",
          "opening_hours",
          "website",
          "photos",
          "rating",
          "reviews",
          "types",
          "icon",
          "price_level",
        ],
      };

      // Fetch detailed information
      service.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
        if (detailsStatus === google.maps.places.PlacesServiceStatus.OK) {
          console.log("Place mega details:", placeDetails);
          state.clickedMarkerDetails = placeDetails;
        } else {
          console.error("Error fetching place details:", detailsStatus);
          return null;
        }
      });
} catch (error) {
    console.error("Error in fetching places:", error);
}
}
import Swal from 'sweetalert2';
export function throwRegularAlert(stringTitle, stringBody, optionalFunc){
  Swal.fire({
    title: stringTitle,
    text: stringBody,
    backdrop: true,
    confirmButtonText: 'OK',
    color: '#fff',
    background: '#181A1B',
    confirmButtonColor: '#9F7AEA',
    customClass: {
      popup: 'alert-dialog-popup',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('OK clicked:', result.value);
      //if we passed a func, call it
      if(optionalFunc !== null){
        optionalFunc();
      }
    } else if (result.isDismissed) {
      console.log('User left the dialog without pressing OK. np.');
    }
  });
};

export function throwMessageAlert(stringTitle, timer = 1000) {
  return Swal.fire({
    position: "bottom",
    width: 300,
    title: stringTitle,
    showConfirmButton: false,
    timer: timer
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('Message alert closed by timer');
    }
  });
}

export function throwSavedGroupManagementPopup(state, selectOptions){
  const newArray = selectOptions.map(option => option.name);
  Swal.fire({
    title: "Choose a group to remove",
    text: "Choose a group from the dropdown and press 'Delete selected', or cancel to exit the window without making any changes.",
    input: "select",
    inputPlaceholder: '-- Choose a previous group --',
    inputOptions: newArray,
    backdrop: true,
    showCancelButton: true,
    confirmButtonText: 'Delete selected',
    color: '#fff',
    background: '#181A1B',
    confirmButtonColor: '#9F7AEA',
    customClass: {
      popup: 'alert-dialog-popup',
      input: 'custom-dropdown',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if(result.value){//if we actually chose something that isnt just the default value.
        console.log('OK clicked:', result.value, ' equivalent to group: ', selectOptions[result.value]); //this is the index in the array.
        removeSavedGroupFromUserDoc(state, selectOptions[result.value].key);
        throwRegularAlert("Removed group",'Removed ' + selectOptions[result.value].name + ' from previous groups! Join the group again with its join-key to re-save it.', null);
      }
      else{
        throwRegularAlert("No group selected",'You did not select a group. No changes were made.', null);
      }
    } else if (result.isDismissed) {
      console.log('User left the dialog without pressing OK. np.');
      throwRegularAlert("No changes made",'No groups were removed.', null);
    }
  });
};

export async function throwManualPositionUpdatePopup(state){
  Swal.fire({
    title: "Update position manually",
    text: "Enter your current location address. We will then find your position using google maps.",
    backdrop: true,
    confirmButtonText: 'OK',
    showCancelButton: true,
    input: "text",
    inputLabel: "Your street address.",
    color: '#fff',
    background: '#181A1B',
    confirmButtonColor: '#9F7AEA',
    customClass: {
      popup: 'alert-dialog-popup',
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log('OK clicked:', result.value);
      const searchText = result.value;
      //api call occurs here to find geocoding
      try{
        if (!searchText.trim()) {
          console.log("Please enter a valid address or place name.");
          return;
        }
        const { Geocoder } = await google.maps.importLibrary("geocoding");
        const geocoder = new Geocoder();
        const request = {
          address: searchText, // The address or place name to geocode
        };
        geocoder.geocode(request, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            const location = results[0].geometry.location;
            console.log(`Latitude: ${location.lat()}, Longitude: ${location.lng()}`);
            if(location && location.lat() && location.lng()){
              store.dispatch("updateUserCoords", {
                lat: location.lat(),
                lng: location.lng(),
              });
            }
          } else {
            console.error("Geocoding failed:", status);
            throwRegularAlert("No such place", "Verify your spelling and try again.", null);
          }
        });
      }catch (error) {
        console.error("Error geocoding address:", error);
        alert("An error occurred while retrieving coordinates.");
      }
      //api call occurs here to findgeocoding
    } else if (result.isDismissed) {
      console.log('User left the dialog without pressing OK. np.');
    }
  });
}

export function clearSearchMapMarkers(state){
  state.locationMapMarkers.forEach((marker) => {
    marker.setVisible(false);
    marker.setMap(null);
    marker = null;
  });
  state.locationMapMarkers = [];
};

export async function updateUserPositionInGroup(state, coords){
  const db = getFirestore();
  const groupRef = doc(db, "groups", state.groupKey);
  try{
  const groupDoc = await getDoc(groupRef);

  if (groupDoc.exists()) {
      const groupData = groupDoc.data();
      console.log("Data in group when updating user position ", groupData);
      if (Array.isArray(groupData.members)) {

        const updatedMembers = groupData.members.map(member => {
          if (member.uid === state.user.uid) {
            return {
              ...member,
              coords: { lat: coords.lat, lng: coords.lng }, // Update the coordinates
            };
          }
          return member; // Return other members unchanged
        });
        await updateDoc(groupRef, { members: updatedMembers });
        console.log("User position updated successfully in group doc!");
      } else {
          console.error("members is not an array in the group document.");
      }
  } else {
      console.error("Group document does not exist.");
  }
}catch (error) {
  console.error("Error updating user position in group:", error);
}
};


export async function dataSearchMapWithCurrentQuery(state){
  if (!state.currentMapSearchQuery.trim()) {
    console.log("Please enter a search query.");
    return;
  }

  try {
    const { PlacesService } = await google.maps.importLibrary("places");
    
    const request = {
      query: state.currentMapSearchQuery,
      location: new google.maps.LatLng(state.groupMidpoint.lat, state.groupMidpoint.lng),
      radius: 1000, //in meters
      fields: ["name", "geometry", "business_status", "website", "openingHours", "opening_hours"],
    };

    const service = new PlacesService(state.map); // Use the map passed as a prop

    service.textSearch(request, async (results, status) => {
      console.log('Search results:', results);
      console.log('Search status:', status);
      clearSearchMapMarkers(state);

      if (status === google.maps.places.PlacesServiceStatus.OK) {
        state.latestPlaceSearch = results;
        console.log('Updated model to include latest place search result: ', state.latestPlaceSearch);

        if (state.map instanceof google.maps.Map) {
          const { LatLngBounds } = await google.maps.importLibrary("core");
          const bounds = new LatLngBounds();

          //add marker coordinates to model
          results.forEach((place) => {
            const mapMarker = new google.maps.Marker({
              map: state.map,
              position: place.geometry.location,
              title: place.name,
            });
            //this is what registers a click on this specific marker on the map.
            mapMarker.addListener("click", () => {
              console.log(`Marker clicked: ${place.name}`);
              console.log(`Coordinates: ${place.geometry.location.lat()}, ${place.geometry.location.lng()}`);
              store.dispatch('userInterestedInLocation', place);
            });

            bounds.extend(place.geometry.location);
            store.dispatch('addLocationMarker', mapMarker);
          });
          state.map.fitBounds(bounds); // Fit map to bounds of the markers
        } else {
          console.error("Map is not valid");
        }
      } else {
        alert("No results found.");
      }
    });
  } catch (error) {
    console.error("Error fetching places:", error);
    alert("An error occurred while fetching places.");
  }
};

export async function createUserDocIfNoneExists(state) {
  const db = getFirestore();

  // Check if the state has a valid user object
  if (!state.user || !state.user.uid) {
    console.error("Cannot create user document: user is missing or invalid.");
    return;
  }

  // Reference to the user's document
  const userDocRef = doc(db, "users", state.user.uid);

  try {
    // Check if the document exists
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      console.log("User document does not exist. Creating a new one...");

      // Create the user document with default data
      const defaultUserData = {
        groupKey: "",
        savedGroups: [],
      };

      await setDoc(userDocRef, defaultUserData);

      console.log("User document created successfully.");
    } else {
      console.log("User document already exists. No action needed.");
    }
  } catch (error) {
    console.error("Error creating or checking user document:", error);
  }
}