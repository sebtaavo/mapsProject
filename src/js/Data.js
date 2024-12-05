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
          console.log("Fetched data from persisted model! in subscribeToGroup.")
        } else {
          console.error("Group document does not exist!");
        }
      }, (error) => {
        console.error("Error subscribing to group:", error);
      });

      state.groupUnsubscribe = subscription;
};