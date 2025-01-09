<template>
  <create-unit
    class="bg-white"
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
