<template>
  <v-paginate :list="equipmentList" perPage="30">
    <template v-slot="paginate">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Specification</th>
              <th>Equipment Number</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Capacity</th>
              <th>Criticality</th>
              <th>Unit</th>
              <th>Date Acquired</th>
            </tr>
          </thead>
          <tbody v-if="paginate.list.length > 0">
            <tr v-for="equipment in paginate.list" :key="equipment.id">
              <td>
                <span class="tx-inverse tx-14 tx-medium d-block">{{
                  equipment.specification
                }}</span>
              </td>
              <td>
                <span class="tx-14 d-block">{{
                  equipment.equipment_number
                }}</span>
              </td>
              <td>
                <span class="tx-14 d-block">{{ equipment.category }}</span>
              </td>
              <td>
                <span class="tx-14 d-block">{{ equipment.brand }}</span>
              </td>
              <td>
                <span class="tx-14 d-block">{{ equipment.capacity }}</span>
              </td>
              <td>
                <span class="tx-14 d-block">{{ equipment.criticality }}</span>
              </td>
              <td>
                <span class="tx-14 d-block"
                  >{{ equipment.unit }}
                  <span v-if="equipment.unit_parent"
                    >({{ equipment.unit_parent }})</span
                  >
                </span>
              </td>
              <td>
                <span class="tx-14 d-block">{{ equipment.acquired_at }}</span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="8">
                <h5>No data to display</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template
      v-slot:linksWrapper
      class="card-footer tx-13 pd-y-15 bg-transparent"
    ></template>
  </v-paginate>
</template>

<script>
import vPaginate from "@/components/ui/paginate";

export default {
  components: { vPaginate },
  props: ["equipmentList"]
};
</script>
