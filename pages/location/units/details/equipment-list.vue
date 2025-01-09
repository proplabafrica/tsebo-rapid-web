<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/location/units/details/equipment-list?id=${unit.id}`"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          :to="`/location/units/details/equipment-list/create?id=${unit.id}`"
          class="nav-link"
          exact-active-class="active"
        >
          <i class="icon ion-compose"></i> Add Equipment
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <keep-alive>
      <nuxt-child
        @update="update()"
        @listRefreshed="refresh = false"
        :refresh="refresh"
        :unit="unit"
      />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data: () => ({
    refresh: true
  }),
  methods: {
    update() {
      this.refresh = true;
      this.$emit("update");
    }
  },
  props: ["unit"]
};
</script>
