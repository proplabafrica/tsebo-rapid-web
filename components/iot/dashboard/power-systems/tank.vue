<template>
<div>
  <div class="vue-root">
    <smart-tank id="tank" :max="tankSize" :value="tankLevel" interval="10" style="border-radius:10px"></smart-tank>
  </div>
  
</div>
</template>

<script>
import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.tank.js";

export default {
  

    mounted(){
    
  },
  props:["tankLevel", "tankSize"]
  
};
</script>

<style>
smart-tank {
  width: 400px !important;
  height: 400px;
  
}

.vue-root{
    pointer-events: none;
}

@media only screen and (max-width: 700px) {
  smart-tank {
    width: 100%;
  }
}
</style>