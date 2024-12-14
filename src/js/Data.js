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
            //add group to saved groups if its not already there
            
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
      console.log("When removing saved group, found data: ", userData);
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
          console.log("Place details:", placeDetails);
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
export function throwSavedGroupManagementPopup(state, selectOptions){
  const newArray = selectOptions.map(option => option.name);
  Swal.fire({
    title: "Choose a group to remove",
    text: "Choose a group from the dropdown and press 'Delete selected', or cancel to exit the window without making any changes.",
    input: "select",
    inputPlaceholder: '-- Choose a saved group --',
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
        throwRegularAlert("Removed group",'Removed ' + selectOptions[result.value].name + ' from saved groups! Join the group again with its join-key to re-save it.', null);
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