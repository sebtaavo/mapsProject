import { 
  doc, 
  onSnapshot 
} from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';

export function groupSubscription(state){
      //LIKE COMMENT SUBSCRIBE
      const db = getFirestore();
      // Unsubscribe from the current group if already subscribed
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
          state.groupMembers = groupData.members || [];
          state.kickedMembers = groupData.kickedMembers || [];
          state.adminUid = groupData.adminUid || '';
          state.groupMidpoint = calculateGeographicalMidpoint(state.groupMembers);
          console.log("group mid point is: ", state.groupMidpoint);
          CLEAR_GROUP_MEMBER_MAP_MARKERS(state);
          RENDER_GROUP_MEMBER_MARKERS_ON_MAP(state);

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
    marker.setMap(null); // Remove the marker from the map
    marker = null;
  });
  state.groupMemberMapMarkers = []; // Clear the array of markers
};

//test section

export function userSubscription(state){
  //LIKE COMMENT SUBSCRIBE
  const db = getFirestore();
  // Unsubscribe from the current group if already subscribed
  if (state.userUnsubscribe) {
    state.userUnsubscribe(); //calling the subscription cancels it out!!!
    state.userUnsubscribe = null; //clears the stored function
  }
  //reference to the group document in Firestore
  if (!state.user) {
    console.error("Could not subscribe to user on launch: user uid is missing or invalid. Probably not logged in.");
    return;
  }
  const userDocRef = doc(db, "users", state.user.uid);
  //set up Firestore listener
  const subscription = onSnapshot(userDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      state.groupKey = userData.groupKey || '';
      if(state.groupKey === ''){//happens if we were kicked sadge
        state.groupMembers = [];
        state.kickedMembers = [];
        state.adminUid = null;
        state.writtenGroupKey = '';
        state.groupMidpoint = state.userCoords;
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

  // Convert each member's lat/lng to radians and calculate Cartesian coordinates
  members.forEach(({ coords: { lat, lng } }) => {
    const latRad = (lat * Math.PI) / 180; // Convert latitude to radians
    const lngRad = (lng * Math.PI) / 180; // Convert longitude to radians

    x += Math.cos(latRad) * Math.cos(lngRad);
    y += Math.cos(latRad) * Math.sin(lngRad);
    z += Math.sin(latRad);
  });

  const total = members.length;

  // Average out x, y, and z
  x /= total;
  y /= total;
  z /= total;

  // Convert back to lat/lng
  const hyp = Math.sqrt(x * x + y * y); // Calculate the hypotenuse

  const midpointLat = Math.atan2(z, hyp) * (180 / Math.PI); // Latitude in degrees
  const midpointLng = Math.atan2(y, x) * (180 / Math.PI); // Longitude in degrees
  return { lat: midpointLat, lng: midpointLng };
};