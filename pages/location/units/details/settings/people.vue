<template>
  <div>
    <unit-occupants class="pd-20" :unit="unit" @update="$emit('update')" v-if="
      authUser.roles[0].code == 'SYS' ||
      authUser.roles[0].code == 'OA' ||
      authUser.roles[0].code == 'FM'
    " />
    <unit-facility-managers class="pd-20" :unit="unit" @update="$emit('update')" v-if="
      authUser.roles[0].code == 'SYS' ||
      authUser.roles[0].code == 'OA' ||
      authUser.roles[0].code == 'FM'
    " />
    <unit-procurement-officers class="pd-20" :unit="unit" @update="$emit('update')" />
  </div>
</template>

<script>
import unitFacilityManagers from "@/components/location/units/people/facility-managers";
import unitOccupants from "@/components/location/units/people/occupants";
import unitProcurementOfficers from "@/components/location/units/people/procurement-officers";

import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { unitFacilityManagers, unitOccupants, unitProcurementOfficers },
  head: () => ({
    title: "People · Unit Settings · Tsebo-Rapid"
  }),
  mixins: [authMixin, formMixin],
  props: ["unit"]
};
</script>
