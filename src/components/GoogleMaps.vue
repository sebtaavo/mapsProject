
<template>
    <div>
        <GoogleMap
            :api-key= "apiKey"
            style="width: 100%; height: 500px"
            :center="{lat: lat, lng: lng}"
            :zoom="15"
            >
                <Marker :options="{ position: {lat: lat, lng: lng}, label: {text: 'S', color: 'blue'}, title: 'Sebastians location'}" />
                <Marker :options="{ position: {lat: lat+0.001, lng: lng} }" />
        </GoogleMap>
    </div>
</template>

<script>
import{GoogleMap, Marker} from 'vue3-google-map';
import{APIkey} from '../js/apiKEY.js';
export default {
    components:{
        GoogleMap,
        Marker
    },
    data(){
        return{
            apiKey: APIkey,
            lat: null,
            lng: null,
        }
    },

  created() {
    this.$getLocation()
      .then((coordinates) => {
        console.log(coordinates);
        this.lat = coordinates.lat;
        this.lng = coordinates.lng;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>