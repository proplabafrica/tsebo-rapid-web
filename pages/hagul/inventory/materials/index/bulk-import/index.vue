<template>
  <v-paginate :list="materials" perPage="30">
    <template v-slot="paginate">
      <div class="table-responsive">
        <table class="table table-striped mg-b-0">
          <thead>
            <tr>
              <th>Material</th>
              <th>unit Cost</th>
              <th>Stock</th>
              <th>Min/Max</th>
            </tr>
          </thead>
          <tbody v-if="paginate.list.length > 0">
            <tr v-for="material in paginate.list" :key="material.id">
              <td>
                <nuxt-link
                  :to="`/hagul/inventory/materials/details?id=${material.id}`"
                  class="tx-inverse tx-14 tx-medium d-block"
                  v-text="material.name"
                ></nuxt-link>
                <span class="tx-11 d-block" v-if="material.code"
                  >#{{ material.code }}</span
                >
                <span class="tx-11 d-block">
                  <span
                    v-for="(category, index) in material.categories"
                    :key="category.id"
                    >{{ category.name
                    }}{{
                      index + 1 >= material.categories.length ? "" : ", "
                    }}</span
                  >
                </span>
              </td>
              <td>
                <span>&#8358;{{ material.cost | moneyFormat }}</span>
              </td>
              <td>
                <span
                  class="tx-14 tx-medium d-block"
                  v-text="material.stock"
                ></span>
              </td>
              <td>
                <span class="tx-14 tx-medium d-block"
                  >{{ material.min_stock }}/{{ material.max_stock }}</span
                >
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="3">
                <h6>No data to display</h6>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- table-responsive -->
    </template>
    <!-- table-responsive -->
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
  props: ["materials"]
};
</script>
