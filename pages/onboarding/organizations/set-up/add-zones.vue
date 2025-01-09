<template>
  <create-hierarchy
    class="pd-t-5 pd-lg-t-0 pd-lg-l-10"
    :organization="organization"
    :parentHierarchy="zoneHierarchy"
    @update="$emit('zonesAdded', { hierarchy: zoneHierarchy, organization })"
  />
</template>

<script>
import createHierarchy from "@/components/location/units/create-hierarchy";

export default {
  components: { createHierarchy },
  props: ["organization", "zoneHierarchy"]
};
</script>
