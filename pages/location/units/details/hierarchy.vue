<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/location/units/details/hierarchy?id=${unit.id}`"
          class="nav-link"
          exact-active-class="active"
          >Levels</nuxt-link
        >
        <!-- <div>{{unit}}</div> -->
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          v-action-show="'unit-hierarchies.store'"
          :to="`/location/units/details/hierarchy/create-hierarchy?id=${unit.id}`"
        >
          <i class="icon ion-compose"></i> Create Level
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child
      :hierarchies="unit.hierarchies"
      :organization="unit.organization"
      :parentHierarchy="unit.hierarchy"
      :parentUnit="unit"
      @update="$emit('update')"
    />
  </div>
  <!-- section-wrapper -->
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  meta: {
    pageName: "location.units.details.hierarchy"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  props: ["unit"]
};
</script>
