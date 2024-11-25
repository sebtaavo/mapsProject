<template>
    <div class="sidebar">
      <div class="group-members">
        <h2 class="heading">Group Members</h2>
        <ul class="member-list">
          <li class="member-item" v-for="member in groupMembers" :key="member.name">
            <img :src="member.icon" class="member-icon" alt="User Icon" />
            {{ member.name }}
          </li>
        </ul>
        <button class="group-button">Other Groups</button>
        <hr class="divider" />
      </div>
  
      <div class="join-input-container">
        <input type="text" placeholder="     Join Through Key" class="join-input" id="join-input" />
      </div>
  
      <div class="categories">
        <button class="category-button" v-for="category in categories" :key="category.name">
          <img :src="category.icon" class="category-icon" :alt="category.alt" />
          <span>{{ category.name }}</span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  
  import { groupMembers, categories } from '../js/Data.js';
  
  export default {
    name: 'Sidebar',
    data() {
      return {
        groupMembers,
        categories,
      };
    },
  };
  </script>