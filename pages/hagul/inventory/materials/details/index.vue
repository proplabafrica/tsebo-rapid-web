<template>
  <v-paginate
    class="bg-white"
    :list="salesOrderItems"
    perPage="30"
    v-if="!salesOrderItemsLoading"
  >
    <template v-slot="paginate">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Sales Order</th>
              <th>Quantity</th>
              <th>Date Requested</th>
              <th>Date Dispatched</th>
            </tr>
          </thead>
          <tr v-for="item in salesOrderItems" :key="item.id">
            <td>
              <nuxt-link
                :to="`/hagul/inventory/sales-orders/details?id=${item.salesOrder.id}`"
                class="tx-inverse tx-14 tx-medium d-block"
                v-text="item.salesOrder.code"
              ></nuxt-link>
              <span
                class="d-block tx-12 tx-inverse"
                v-text="item.salesOrder.status.name"
              ></span>
            </td>
            <td>
              <span v-text="item.quantity"></span>
            </td>
            <td>
              <span>{{ item.created_at | dateFormat }}</span>
            </td>
            <td>
              <span>{{ dispatchedAt(item.salesOrder) | dateFormat }}</span>
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
    this.getSalesOrderItems();
  },
  data: () => ({
    salesOrderItems: [],
    salesOrderItemsLoading: true
  }),
  meta: {
    pageName: "materials.show"
  },
  methods: {
    dispatchedAt(salesOrder) {
      const dispatchLog = salesOrder.logs.find(
        (log) => log.status.code == "dispatched"
      );
      return dispatchLog ? dispatchLog.created_at : null;
    },
    async getSalesOrderItems() {
      const byMaterialId = this.material.id;

      try {
        this.salesOrderItems = (
          await this.$axios.get("sales-order-items", {
            params: {
              associations: ["salesOrder.logs.status", "salesOrder.status"],
              byMaterialId,
              page: 1,
              perPage: 200,
              sortOrder: "desc"
            }
          })
        ).data.data;
        this.salesOrderItemsLoading = false;
      } catch (error) {
        console.log(error);
      }
      return true;
    }
  },
  mixins: [authMixin],
  props: ["material"]
};
</script>
