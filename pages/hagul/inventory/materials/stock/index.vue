<template>
  <v-paginate
    class="bg-white"
    :list="materials"
    perPage="30"
    v-if="!materialsLoading"
  >
    <template v-slot="paginate">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Material</th>
              <th>Min Stock</th>
              <th>Stock</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tr v-for="item in paginate.list" :key="item.id">
            <td>
              <nuxt-link
                :to="`/hagul/inventory/sales-orders/details?id=${item.id}`"
                class="tx-inverse tx-14 tx-medium d-block"
                v-text="item.name"
              ></nuxt-link>
              <!-- <span
                class="d-block tx-12 tx-inverse"
                v-text="item.min_stock"
              ></span> -->
            </td>
            <td>
              <span v-text="item.min_stock"></span>
            </td>
            <td>
              <span>{{ item.stock }}</span>
            </td>
            <td>
              <span>{{ item.created_at | dateFormat }}</span>
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template
      v-slot:linksWrapper
      class="card-footer tx-13 pd-y-15 bg-transparent"
    ></template>
  </v-paginate>
  <!-- v-paginate -->
  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getMaterials(this);
  },
  data: () => ({
    materialSearch: null,
    materials: [],
    materialsLoading: true,
    materialToDelete: [],
    disabled: null
  }),
  meta: {
    pageName: "materials.show"
  },
  methods: {
    async getMaterials() {
      try {
        this.materialsLoading = true;
        const response = await this.$axios.get("materials", {
          params: {
            associations: ["categories", "currency"]
          }
        });
        this.materials = response.data.data.filter((data) => data.stock <= 1);
        this.materialsLoading = false;
      } catch (error) {}
    }
  },
  mixins: [authMixin],
  props: ["material"]
};
</script>
