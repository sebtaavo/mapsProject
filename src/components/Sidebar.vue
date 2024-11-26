<template>
  <div class="sidebar">
    <div class="group-members">
      <h2 class="heading">Group Members</h2>
      <ul class="member-list">
        <li v-if="groupMembers.length === 0" class="member-item">
          Join a group to see group members.
        </li>
        <li v-for="member in groupMembers" :key="member.uid" class="member-item">
          <img :src="member.icon || 'path_to_default_icon_or_gravatar'" class="member-icon" alt="User Icon" />
          {{ member.name }}
        </li>
      </ul>

      <!-- Show "Leave Group" button only if the user is in a group -->
      <button v-if="groupMembers.length !== 0" class="group-button" @click="leaveGroup">Leave Group</button>
      <hr class="divider" />
    </div>

    <div class="join-input-container">
      <input
        type="text"
        v-model="groupKey"
        placeholder="     Join Through Key"
        class="join-input"
        id="join-input"
        @keyup.enter="joinGroup" 
      />
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { categories } from '../js/Data.js';

export default {
  name: 'Sidebar',
  data() {
    return {
      groupKey: '', // Store the group key input by the user
      groupMembers: [], // This will hold the members of the group
      categories,   // Existing categories
      user: null,   // Current logged in user
      groupStatus: '' // Feedback for the user (e.g., success or error)
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.checkUserGroup(); // Check if the user is part of a group when mounted
      } else {
        this.user = null;
      }
    });
  },
  methods: {
  // Method to handle group joining
  async joinGroup() {
    if (!this.groupKey || !this.user) {
      this.groupStatus = "Please enter a group key and make sure you're logged in.";
      return;
    }

    const db = getFirestore();
    const groupRef = doc(db, "groups", this.groupKey); // Reference to the group in Firestore

    try {
      // Fetch the group data from Firestore
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
        const groupData = groupSnap.data();
        const members = groupData.members || [];

        // Check if the user is already a member of the group
        const isMember = members.some(member => member.uid === this.user.uid);

        if (isMember) {
          this.groupStatus = "You are already a member of this group.";
          return;
        }

        // Add the current user to the group
        await updateDoc(groupRef, {
          members: [
            ...members,
            {
              uid: this.user.uid,
              name: this.user.displayName,
              email: this.user.email,
              icon: this.user.photoURL || 'path_to_default_icon_or_gravatar' // Add photo if available
            }
          ]
        });

        // Update the feedback message
        this.groupStatus = `Successfully joined group ${this.groupKey}!`;

        // Save the group key in local storage to persist membership across page reloads
        localStorage.setItem('userGroup', this.groupKey);

        // Update group members locally
        this.groupMembers = [
          ...members,
          {
            uid: this.user.uid,
            name: this.user.displayName,
            icon: this.user.photoURL || 'path_to_default_icon_or_gravatar'
          }
        ];
      } else {
        // Group not found
        this.groupStatus = `Group with key ${this.groupKey} not found.`;
      }
    } catch (error) {
      console.error("Error joining group: ", error);
      this.groupStatus = "An error occurred while joining the group.";
    }
  },

  // Check if the user is already part of a group on page load
  async checkUserGroup() {
    const groupKey = localStorage.getItem('userGroup');
    if (groupKey) {
      this.groupKey = groupKey;
      // Now, fetch and display the group members
      const db = getFirestore();
      const groupRef = doc(db, "groups", groupKey);
      try {
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
          this.groupMembers = groupData.members || [];
        }
      } catch (error) {
        console.error("Error fetching group data: ", error);
      }
    }
  },

  // Method to leave the group
  async leaveGroup() {
    if (!this.groupKey || !this.user) {
      this.groupStatus = "You are not currently in a group.";
      return;
    }

    const db = getFirestore();
    const groupRef = doc(db, "groups", this.groupKey); // Reference to the group in Firestore

    try {
      // Fetch the group data from Firestore
      const groupSnap = await getDoc(groupRef);

      if (groupSnap.exists()) {
        const groupData = groupSnap.data();
        const members = groupData.members || [];

        // Remove the current user from the group
        await updateDoc(groupRef, {
          members: arrayRemove({
            uid: this.user.uid,
            name: this.user.displayName,
            email: this.user.email,
            icon: this.user.photoURL || 'path_to_default_icon_or_gravatar'
          })
        });

        // Update the feedback message
        this.groupStatus = `Successfully left group ${this.groupKey}.`;

        // Clear the group data locally
        this.groupMembers = [];

        // Remove the group key from local storage
        localStorage.removeItem('userGroup');
      } else {
        // Group not found
        this.groupStatus = `Group with key ${this.groupKey} not found.`;
      }
    } catch (error) {
      console.error("Error leaving group: ", error);
      this.groupStatus = "An error occurred while leaving the group.";
    }
  }
}

};
</script>
