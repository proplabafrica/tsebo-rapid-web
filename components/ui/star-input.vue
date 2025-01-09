<template>
  <div>
    <i
      v-for="star in rangeArray"
      :key="star"
      @click="selectStar(star)"
      class="icon ion-ios-star pd-5 cursor-pointer"
      :class="{ 'tx-warning': stars.includes(star) }"
    ></i>
  </div>
</template>

<script>
export default {
  created() {
    this.starValue = this.value;
  },
  data: () => ({
    starValue: null,
    stars: []
  }),
  methods: {
    selectStar(star) {
      this.starValue = star;
      this.stars = [];
      for (const item of this.rangeArray) {
        if (!this.stars.includes(star)) {
          this.stars.push(item);
        }
      }
    }
  },
  props: ["rangeArray", "value"],
  watch: {
    starValue(star) {
      this.$emit("input", star);
    }
  }
};
</script>
