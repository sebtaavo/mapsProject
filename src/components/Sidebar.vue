<template>
  <div class="sidebar">
    <div class="group-members">
      <h2 class="heading">Group Members</h2>
      <ul class="member-list">
        <li v-if="!user" class="member-item">
          Please log in to join a group.
        </li>
        <li v-else-if="groupMembers.length === 0" class="member-item">
          Join a group to see group members.
        </li>
        <li
          v-for="(member, index) in groupMembers"
          :key="member.uid"
          class="member-item"
        >
          <img :src="member.icon || 'path_to_default_icon_or_gravatar'" class="member-icon" alt="User Icon" />
          {{ member.name }}
          <span v-if="member.uid === adminUid" class="admin-label">(Admin)</span>
          <button
            v-if="user.uid === adminUid && member.uid !== adminUid"
            class="kick-button"
            @click="kickMember(member)"
          >
            Kick
          </button>
        </li>
      </ul>
      <button v-if="groupMembers.length !== 0" class="group-button" @click="leaveGroup">Leave Group</button>
      <hr class="divider" />
    </div>


    <div class="join-input-container">
      <input
        type="text"
        v-model="groupKey"
        placeholder="Join Through Key"
        class="join-input"
        id="join-input"
        @keyup.enter="joinGroup"
      />
    </div>

    <div v-if="user && !groupKey" class="create-group-container">
      <button class="create-group-button" @click="createGroup">
        Create Your Own Group
      </button>
    </div>

    <div class="categories">
      <button
        class="category-button"
        v-for="category in categories"
        :key="category.name"
      >
        <img :src="category.icon" class="category-icon" :alt="category.alt" />
        <span>{{ category.name }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { 
  getAuth, 
  onAuthStateChanged 
} from "firebase/auth";
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
import { categories } from '../js/Data.js';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'Sidebar',
  data() {
    return {
      groupKey: '', // Group key input by the user
      groupMembers: [], // List of members in the group
      categories, // Sidebar categories
      user: null, // Current logged-in user
      adminUid: '', // Admin UID for the current group
      kickedMembers: [] // List of kicked members for the current group
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.checkUserGroup();
      } else {
        this.user = null;
        this.groupMembers = [];
        this.groupKey = '';
      }
    });
  },
  methods: {
    // Create a new group
    async createGroup() {
      if (!this.user) {
        console.log("You need to be logged in to create a group.");
        return;
      }

      const db = getFirestore();
      const newGroupKey = uuidv4();
      const groupRef = doc(db, "groups", newGroupKey);

      try {
        await setDoc(groupRef, {
          adminUid: this.user.uid,
          members: [
            {
              uid: this.user.uid,
              name: this.user.displayName,
              email: this.user.email,
              icon: this.user.photoURL
            }
          ],
          kickedMembers: [] // Initialize kicked members list
        });

        const userRef = doc(db, "users", this.user.uid);
        await setDoc(userRef, { groupKey: newGroupKey });

        this.groupKey = newGroupKey;
        this.adminUid = this.user.uid;

        this.listenToGroupUpdates(newGroupKey);
        console.log(`Group created successfully! Share your key: ${newGroupKey}`);
      } catch (error) {
        console.error("Error creating group: ", error);
        console.log("An error occurred while creating the group.");
      }
    },

    // Join a group
    async joinGroup() {
      if (!this.groupKey || !this.user) {
        console.log("Please enter a group key and make sure you're logged in.");
        return;
      }

      const db = getFirestore();
      const groupRef = doc(db, "groups", this.groupKey);

      try {
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
          const groupData = groupSnap.data();

          // Check if user is in the kicked members list
          if (groupData.kickedMembers?.includes(this.user.uid)) {
            console.log("You have been kicked from this group and cannot rejoin.");
            return;
          }

          const members = groupData.members || [];

          if (members.some(member => member.uid === this.user.uid)) {
            console.log("You are already a member of this group.");
            return;
          }

          await updateDoc(groupRef, {
            members: [
              ...members,
              {
                uid: this.user.uid,
                name: this.user.displayName,
                email: this.user.email,
                icon: this.user.photoURL || 'path_to_default_icon_or_gravatar'
              }
            ]
          });

          const userRef = doc(db, "users", this.user.uid);
          await setDoc(userRef, { groupKey: this.groupKey });

          this.listenToGroupUpdates(this.groupKey);
          console.log(`Successfully joined group ${this.groupKey}!`);
        } else {
          console.log(`Group with key ${this.groupKey} not found.`);
        }
      } catch (error) {
        console.error("Error joining group: ", error);
        console.log("An error occurred while joining the group.");
      }
    },

    // Check user's current group
    async checkUserGroup() {
      const db = getFirestore();
      const userRef = doc(db, "users", this.user.uid);

      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.groupKey = userData.groupKey || '';

          if (this.groupKey) {
            this.listenToGroupUpdates(this.groupKey);
          }
        }
      } catch (error) {
        console.error("Error fetching user group: ", error);
      }
    },

    // Listen for real-time updates to group data
    listenToGroupUpdates(groupKey) {
      const db = getFirestore();
      const groupRef = doc(db, "groups", groupKey);

      onSnapshot(groupRef, (docSnap) => {
        if (docSnap.exists()) {
          const groupData = docSnap.data();
          this.groupMembers = groupData.members || [];
          this.adminUid = groupData.adminUid || '';
          this.kickedMembers = groupData.kickedMembers || [];
        }
      });
    },
// Leave group
async leaveGroup() {
      if (!this.groupKey || !this.user) return;

      const db = getFirestore();
      const groupRef = doc(db, "groups", this.groupKey);
      const userRef = doc(db, "users", this.user.uid);

      try {
        await updateDoc(groupRef, {
          members: arrayRemove({
            uid: this.user.uid,
            name: this.user.displayName,
            email: this.user.email,
            icon: this.user.photoURL || 'path_to_default_icon_or_gravatar'
          })
        });

        await setDoc(userRef, { groupKey: '' });
        this.groupKey = '';
        this.groupMembers = [];
        this.groupStatus = "You have left the group.";
      } catch (error) {
        console.error("Error leaving group: ", error);
        this.groupStatus = "An error occurred while leaving the group.";
      }
    },

    
    // Kick a member from the group
    async kickMember(member) {
  if (!this.groupKey || !member) return;

  const db = getFirestore();
  const groupRef = doc(db, "groups", this.groupKey);
  const userRef = doc(db, "users", member.uid);

  try {
    // Remove the member from the group document
    await updateDoc(groupRef, {
      members: arrayRemove(member),
      kickedMembers: arrayUnion(member.uid)
    });

    // Clear the groupKey in the user's document
    await setDoc(userRef, { groupKey: '' }, { merge: true });

    console.log(`${member.name} has been kicked from the group.`);
  } catch (error) {
    console.error("Error kicking member: ", error);
    console.log("An error occurred while removing the member.");
  }
}

  }
};
</script>
