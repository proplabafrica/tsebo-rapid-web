<template>
  <div
    v-if="
      authUser.roles[0].code == 'SYS' ||
      authUser.roles[0].code == 'OA' ||
      authUser.roles[0].code == 'FM'
    "
  >
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/location/units/details?id=${unit.id}`"
          class="nav-link"
          exact-active-class="active"
          >Jobs</nuxt-link
        >
        <nuxt-link
          :to="`/location/units/details/schedules?id=${unit.id}`"
          class="nav-link"
          exact-active-class="active"
        >
          <i class="icon ion-ios-timer-outline tx-14"></i> Schedules
        </nuxt-link>
        <nuxt-link
          :to="`/location/units/details/create-schedule?id=${unit.id}`"
          class="nav-link"
          exact-active-class="active"
        >
          <i class="icon ion-compose tx-14"></i> Create {{ unit.name }} Schedule
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :unit="unit" @update="$emit('update')" />
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  props: ["unit"],
  mixins: [authMixin]
};
</script>
