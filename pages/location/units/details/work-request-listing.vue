<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/location/units/details/work-request-listing`"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <keep-alive>
      <nuxt-child
        @listRefreshed="refresh = false"
        :refresh="refresh"
        :workRequests="workRequests"
      />
    </keep-alive>
  </div>
</template>

<script>
export default {
  created() {
  },
  data: () => ({
    refresh: true
  }),
  methods: {
    // update() {
    //   this.refresh = true;
    //   this.$emit("update");
    // }
  },
  props: ["workRequests"]
};
</script>
