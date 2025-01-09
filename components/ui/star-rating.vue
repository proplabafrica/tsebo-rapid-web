<template>
  <div>
    <i
      v-for="star in rangeArray"
      :key="star"
      class="icon ion-ios-star pd-5"
      :class="{ 'tx-warning': stars.includes(star) }"
    ></i>
  </div>
</template>

<script>
export default {
  computed: {
    stars() {
      var stars = [];
      for (const item of this.rangeArray) {
        if (!stars.includes(this.rating)) {
          stars.push(item);
        }
      }
      return stars;
    }
  },
  props: ["rangeArray", "rating"]
};
</script>
