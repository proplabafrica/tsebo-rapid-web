<template>

  <v-paginate :list="hierarchies" perPage="30">

    <template v-slot="paginate">
      <div class="row" v-if="paginate.list.length > 0">
        <hierarchy-box
          v-for="hierarchy in paginate.list"
          :hierarchy="hierarchy"
          :parentUnit="parentUnit"
          :key="hierarchy.id"
          @update="$emit('update')"
        ></hierarchy-box>
      </div>
      <h5 class="pd-y-20" v-else>No data to display</h5>
    </template>
    <template v-slot:linksWrapper></template>
  </v-paginate>
  <!-- col -->
  <!-- row -->
</template>

<script> 
import hierarchyBox from "@/components/location/units/hierarchy-box";
import vPaginate from "@/components/ui/paginate";
export default {
  components: { hierarchyBox, vPaginate },
  props: ["hierarchies", "parentUnit"]
};
</script>
