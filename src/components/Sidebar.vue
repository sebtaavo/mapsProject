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
        <li v-for="member in groupMembers" :key="member.uid" class="member-item">
          <img :src="member.icon || 'path_to_default_icon_or_gravatar'" class="member-icon" alt="User Icon" />
          {{ member.name }}
          <span v-if="member.uid === adminUid" class="admin-label">(Admin)</span>
        </li>
      </ul>
      <button v-if="groupMembers.length !== 0" class="group-button" @click="leaveGroup">Leave Group</button>
      <hr class="divider" />
    </div>

    <div v-if="user && !groupKey" class="create-group-container">
      <button class="create-group-button" @click="createGroup">
        Create Your Group
      </button>
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
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { categories } from '@/js/Data.js';
import { v4 as uuidv4 } from 'uuid'; // For generating unique group keys

export default {
  name: 'Sidebar',
  data() {
    return {
      groupKey: '', // Group key input by the user
      groupMembers: [], // List of members in the group
      categories, // Sidebar categories
      user: null, // Current logged-in user
      adminUid: '', // Admin UID for the current group
      groupStatus: '' // Feedback status for group actions
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
    // Create a new group and assign the current user as admin
    async createGroup() {
      if (!this.user) {
        this.groupStatus = "You need to be logged in to create a group.";
        return;
      }

      const db = getFirestore();
      const newGroupKey = uuidv4(); // Generate a unique group key
      const groupRef = doc(db, "groups", newGroupKey);

      try {
        await setDoc(groupRef, {
          adminUid: this.user.uid,
          members: [
            {
              uid: this.user.uid,
              name: this.user.displayName,
              email: this.user.email,
              icon: this.user.photoURL || 'path_to_default_icon_or_gravatar'
            }
          ]
        });

        // Save the group key locally and set admin UID
        this.groupKey = newGroupKey;
        this.adminUid = this.user.uid;

        // Add the group key to the user's document in Firestore
        const userRef = doc(db, "users", this.user.uid);
        await setDoc(userRef, { groupKey: newGroupKey });

        this.groupMembers = [
          {
            uid: this.user.uid,
            name: this.user.displayName,
            icon: this.user.photoURL || 'path_to_default_icon_or_gravatar'
          }
        ];

        this.groupStatus = `Group created successfully! Share your key: ${newGroupKey}`;
      } catch (error) {
        console.error("Error creating group: ", error);
        this.groupStatus = "An error occurred while creating the group.";
      }
    },

    // Join an existing group
    async joinGroup() {
      if (!this.groupKey || !this.user) {
        this.groupStatus = "Please enter a group key and make sure you're logged in.";
        return;
      }

      const db = getFirestore();
      const groupRef = doc(db, "groups", this.groupKey);

      try {
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
          const members = groupData.members || [];

          // Check if user is already a member
          const isMember = members.some(member => member.uid === this.user.uid);
          if (isMember) {
            this.groupStatus = "You are already a member of this group.";
            return;
          }

          // Add the user to the group
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

          // Update user's document with the group key
          const userRef = doc(db, "users", this.user.uid);
          await setDoc(userRef, { groupKey: this.groupKey });

          // Update local state
          this.groupMembers = [
            ...members,
            {
              uid: this.user.uid,
              name: this.user.displayName,
              icon: this.user.photoURL || 'path_to_default_icon_or_gravatar'
            }
          ];
          this.adminUid = groupData.adminUid;
          this.groupStatus = `Successfully joined group ${this.groupKey}!`;
        } else {
          this.groupStatus = `Group with key ${this.groupKey} not found.`;
        }
      } catch (error) {
        console.error("Error joining group: ", error);
        this.groupStatus = "An error occurred while joining the group.";
      }
    },

    // Check if the user is part of a group
    async checkUserGroup() {
      const db = getFirestore();
      const userRef = doc(db, "users", this.user.uid);

      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.groupKey = userData.groupKey || '';

          if (this.groupKey) {
            // Fetch group members
            const groupRef = doc(db, "groups", this.groupKey);
            const groupSnap = await getDoc(groupRef);

            if (groupSnap.exists()) {
              const groupData = groupSnap.data();
              this.groupMembers = groupData.members || [];
              this.adminUid = groupData.adminUid || '';
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user group: ", error);
      }
    },

    // Leave the current group
    async leaveGroup() {
      if (!this.groupKey || !this.user) {
        this.groupStatus = "You are not currently in a group.";
        return;
      }

      const db = getFirestore();
      const groupRef = doc(db, "groups", this.groupKey);

      try {
        // Remove the user from the group
        await updateDoc(groupRef, {
          members: arrayRemove({
            uid: this.user.uid,
            name: this.user.displayName,
            email: this.user.email,
            icon: this.user.photoURL || 'path_to_default_icon_or_gravatar'
          })
        });

        // Clear the user's group data
        const userRef = doc(db, "users", this.user.uid);
        await setDoc(userRef, { groupKey: '' });

        this.groupKey = '';
        this.groupMembers = [];
        this.adminUid = '';
        this.groupStatus = "Successfully left the group.";
      } catch (error) {
        console.error("Error leaving group: ", error);
        this.groupStatus = "An error occurred while leaving the group.";
      }
    }
  }
};
</script>
