<template>
  <hierarchy-list
    @update="$emit('update')"
    :parentUnit="parentUnit"
    :hierarchies="hierarchies"
  />
</template>

<script>
import hierarchyList from "@/components/location/units/hierarchy-list";

export default {
  components: { hierarchyList },
  props: ["hierarchies", "parentUnit"]
};
</script>
