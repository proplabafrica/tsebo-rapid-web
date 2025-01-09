<template>
  <create-hierarchy
    class="bg-white pd-20"
    :organization="organization"
    :parentHierarchy="parentHierarchy"
    :parentUnit="parentUnit"
    @update="$emit('update')"
  />
</template>

<script>
import createHierarchy from "@/components/location/units/create-hierarchy";

export default {
  components: { createHierarchy },
  props: ["organization", "parentHierarchy", "parentUnit"]
};
</script>
