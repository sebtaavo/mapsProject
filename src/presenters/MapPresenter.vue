<template>
    <div>
      <Map @ready="handleMapReady" />
    </div>
</template>
  
  <script>
  import Map from '@/components/Map.vue'; // Import your child component
  
  export default {
    components: {
        Map,
    },
    methods: {
      handleMapReady(mapInstance) {
        console.log('Received map instance in parent:', mapInstance);
      },
    },
  };
  </script>