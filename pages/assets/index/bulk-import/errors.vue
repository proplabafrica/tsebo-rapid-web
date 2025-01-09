<template>
  <v-paginate class="col mg-t-10 mg-md-0" :list="invalidRows" perPage="30">
    <template v-slot="paginate">
      <div class="row" v-if="paginate.list.length > 0">
        <div
          class="col-md-6 col-lg-4 pd-md-0"
          v-for="(row, index) in paginate.list"
          :key="`row-${index}`"
        >
          <ul class="list-group">
            <li class="list-group-item ht-100">
              <strong v-if="row.business_name"
                >{{ row.business_name }} (Row {{ row.number }})</strong
              >
              <strong v-else>Row {{ row.number }}</strong>
              <small
                class="d-block mg-b-0"
                v-for="(error, rowIndex) in row.errors"
                :key="rowIndex"
              >
                <strong class="tx-inverse tx-medium"
                  >{{ error.column }}:</strong
                >
                <strong class="tx-danger">{{ error.error }}</strong>
              </small>
            </li>
          </ul>
        </div>
        <!-- col-4 -->
      </div>
      <!-- row -->
      <h4 v-else>No Errors</h4>
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
  props: ["invalidRows"]
};
</script>
