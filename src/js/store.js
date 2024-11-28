import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', function(){
//State
const activeGroup = ref();
const error = ref ();

//Actions
function setCurrentGroup(group_tag){
    activeGroup.value = group_tag;
}

function setMapError(e){
    error.value = e;
}

async function joinGroup(){
    //try to join a group if we have a currentGroup value
    if(currentGroup.value){

    }
}

//Getters, derived state
const getCurrentGroup = computed(() => {
    if (activeGroup.value) {
      return  activeGroup.value;
    }
    return null;
});

//Return the data (model)
return {
    //return the state
    activeGroup,
    error,
    //return the actions
    setCurrentGroup,
    setMapError,
    //return the getters
    getCurrentGroup
}

})