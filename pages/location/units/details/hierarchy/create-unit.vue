<template>
  <create-unit
    class="bg-white pd-20"
    :hierarchies="hierarchies"
    :organization="organization"
    :parentUnit="parentUnit"
    @update="$emit('update')"
  />
</template>

<script>
import createUnit from "@/components/location/units/create-unit";

export default {
  components: { createUnit },
  props: ["hierarchies", "organization", "parentUnit"]
};
</script>
