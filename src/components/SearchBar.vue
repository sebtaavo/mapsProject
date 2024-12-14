<template>
    <div class="search-component">
      <input class= "search-input"
        type="text"
        v-model="query"
        placeholder="Search for places"
        @keyup.enter="searchPlaces"
        @input="updateSearchQuery"
      />
      <button class ="searchButton" @click="searchPlaces">
        <img src="@/images/Search.svg" alt="Search" />  
      </button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      searchPlaces() {
        this.$emit('search-for-places');
      },
      updateSearchQuery(value) {
        this.$emit('update-search-query', value.target.value);
      },
      
    },
  };
  </script>
  
