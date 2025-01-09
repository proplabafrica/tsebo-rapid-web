<template>
  <div>
    <div class="mg-y-10">
      <input
        type="text"
        placeholder="Start typing here to search"
        class="form-control search mg-b-10"
        v-model="salesOrderSearch"
      />
    </div>
    <v-paginate :list="salesOrders" perPage="30" v-if="!salesOrdersLoading">
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table table-striped mg-b-0 tx-13">
            <thead>
              <tr class="tx-10">
                <th class="pd-y-5" width="30%">Order #</th>
                <th class="pd-y-5">Created By</th>
                <th class="pd-y-5">Request Type</th>
                <th class="pd-y-5">Status</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="salesOrder in paginate.list" :key="salesOrder.id">
                <td>
                  <nuxt-link
                    :to="`/hagul/inventory/sales-orders/details?id=${salesOrder.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                    v-text="salesOrder.code"
                  ></nuxt-link>
                  <nuxt-link
                    class="tx-inverse"
                    v-for="(workRequest, index) in salesOrder.workRequests"
                    :key="workRequest.id"
                    :to="`/maintenance/requests/details?id=${workRequest.id}`"
                    >{{ workRequest.name
                    }}{{
                      index + 1 >= salesOrder.workRequests.length ? "" : ", "
                    }}</nuxt-link
                  >
                </td>
                <td class="tx-14">
                  <nuxt-link
                    class="d-block tx-inverse"
                    v-text="salesOrder.createdBy.name"
                    :to="`/people/users/details?id=${salesOrder.createdBy.id}`"
                  ></nuxt-link>
                  <span
                    class="tx-11 d-block"
                    v-for="role in salesOrder.createdBy.roles"
                    :key="role.id"
                    v-text="role.name"
                  ></span>
                </td>
                <td class="tx-14">
                  <span
                    class="d-block"
                    v-text="salesOrder.type.name + ' for'"
                  ></span>
                  <nuxt-link
                    class="tx-11 d-block tx-inverse"
                    v-for="(user, index) in salesOrder.requesters"
                    :key="user.id"
                    :to="`/people/users/details?id=${user.id}`"
                    >{{ user.name
                    }}{{
                      index + 1 >= salesOrder.requesters.length ? "" : ", "
                    }}</nuxt-link
                  >
                </td>
                <td>
                  <!-- <span class="square-8 mg-r-5 rounded-circle bg-primary"></span> -->
                  <span v-text="salesOrder.status.name"></span>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="12">
                  <h5>No data to display</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <!-- table-responsive -->
      <template
        v-slot:linksWrapper
        class="card-footer tx-13 pd-y-15 bg-transparent"
      ></template>
      <!-- card-footer -->
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getSalesOrders(this);
  },
  data: () => ({
    salesOrderSearch: null,
    salesOrders: [],
    salesOrdersLoading: true
  }),
  head: () => ({
    title: "Sales Orders · Hagul"
  }),
  meta: {
    pageName: "hagul.inventory.sales-orders.index"
  },
  methods: {
    ...mapActions({
      getSalesOrders: "hagul/inventory/salesOrders/getSalesOrders"
    })
  },
  middleware: ["auth"],
  mixins: [authMixin],
  watch: {
    salesOrderSearch() {
      this.debounce(() => this.getSalesOrders(this), 500);
    }
  }
};
</script>
