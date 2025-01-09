<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          v-if="
            authUser.roles[0].code == 'SYS' ||
            authUser.roles[0].code == 'OA' ||
            authUser.roles[0].code == 'FM'
          "
          :to="`/location/units/details/settings?id=${unit.id}`"
          class="nav-link"
          exact-active-class="active"
          >General</nuxt-link
        >
        <nuxt-link
          :to="`/location/units/details/settings/people?id=${unit.id}`"
          class="nav-link"
          exact-active-class="active"
        >
          <i class="icon ion-ios-people tx-14"></i> People
        </nuxt-link>
        <nuxt-link
          v-if="
            authUser.roles[0].code == 'SYS' ||
            authUser.roles[0].code == 'OA' ||
            authUser.roles[0].code == 'FM'
          "
          :to="`/location/units/details/settings/slas?id=${unit.id}`"
          class="nav-link"
          exact-active-class="active"
        >
          <i class="icon ion-ios-clock-outline tx-14"></i> SLAs
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :unit="unit" @update="$emit('update')" />
  </div>
  <!-- section-wrapper -->
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  meta: {
    pageName: "location.units.details.settings"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],

  props: ["unit"]
};
</script>
