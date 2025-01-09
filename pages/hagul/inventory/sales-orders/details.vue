<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/inventory/sales-orders">Sales Orders</nuxt-link>
        </li>
        <li
          class="breadcrumb-item"
          v-text="
            salesOrder
              ? salesOrder.name || salesOrder.code
              : 'Sales Order Details'
          "
        ></li>
      </ol>
      <h6
        class="slim-pagetitle"
        v-text="
          salesOrder
            ? salesOrder.name || 'Sales Order #' + salesOrder.code
            : 'Sales Order Details'
        "
      ></h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!loading">
      <div class="col">
        <div class="card card-profile">
          <div class="card-body">
            <div class="media">
              <div class="media-body">
                <h3
                  class="card-profile-name"
                  v-text="salesOrder.name || 'Sales Order #' + salesOrder.code"
                ></h3>
                <span class="card-profile-position d-block">
                  <span v-text="salesOrder.type.name + ' for'"></span>
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
                  <span>
                    <span v-text="' at'"></span>
                    <nuxt-link
                      class="tx-inverse"
                      v-for="workRequest in salesOrder.workRequests"
                      :key="workRequest.id"
                      :to="`/location/units/details?id=${workRequest.unit.id}`"
                    >
                      {{ workRequest.unit.name }}
                    </nuxt-link>
                  </span>
                  <br />
                </span>
                <div class="row">
                  <div class="col mg-t-10">
                    <div class="media">
                      <span class="tx-bold tx-inverse mg-r-5"
                        >Requested By:</span
                      >
                      <nuxt-link
                        class="tx-inverse"
                        v-for="(user, index) in salesOrder.requesters"
                        :key="user.id"
                        :to="`/people/users/details?id=${user.id}`"
                        >{{ user.name
                        }}{{
                          index + 1 >= salesOrder.requesters.length ? "" : ", "
                        }}</nuxt-link
                      >
                    </div>
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5"
                        >Status:</span
                      >
                      <span
                        class="tx-gray-700"
                        v-text="salesOrder.status.name"
                      ></span>
                    </div>
                    <!-- media -->
                  </div>
                  <!-- col -->
                  <div class="col">
                    <div class="media mg-t-10">
                      <nuxt-link
                        :to="`/hagul/purchase/tender-processes/details?id=${salesOrder.tenderProcesses[0].id}`"
                        class="btn btn-primary mg-r-10"
                        v-if="salesOrder.tenderProcesses.length > 0"
                      >
                        <i class="icon ion-ios-pricetag"></i> VIEW TENDER
                        PROCESS
                      </nuxt-link>
                      <purchase-materials
                        class="mg-r-10"
                        v-action-show="'sales-orders.store-tender-process'"
                        v-else-if="
                          salesOrder.status.code == 'pending' &&
                          itemsToPurchase.length > 0
                        "
                        :salesOrder="salesOrder"
                        @update="updateSalesOrder()"
                      />
                      <terminate
                        class="mg-r-10"
                        v-action-show="'sales-orders.terminate'"
                        v-if="
                          !['dispatched', 'terminated'].includes(
                            salesOrder.status.code
                          )
                        "
                        :salesOrder="salesOrder"
                        @update="updateSalesOrder()"
                      />
                    </div>
                    <!-- media -->
                  </div>
                  <!-- col -->
                </div>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
          </div>
          <!-- card-body -->
        </div>
        <!-- card -->

        <ul class="nav nav-activity-profile mg-t-20">
          <li class="nav-item">
            <nuxt-link
              :to="`/hagul/inventory/sales-orders/details?id=${salesOrder.id}`"
              class="nav-link"
              exact-active-class="active"
            >
              <i class="icon ion-ios-list-outline tx-primary"></i> Items
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              :to="`/hagul/inventory/sales-orders/details/activity-log?id=${salesOrder.id}`"
              class="nav-link"
              active-class="active"
            >
              <i class="icon ion-ios-recording-outline tx-primary"></i> Activity
              Log
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child :salesOrder="salesOrder" @update="updateSalesOrder()" />
      </div>
      <!-- col -->

      <div class="col-lg-3 mg-t-10 mg-lg-t-0">
        <div class="card card-people-list">
          <div class="slim-card-title">People Trail</div>
          <people-trail :logs="salesOrder.logs" />
        </div>
        <!-- card -->
      </div>
      <!-- col-3 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
  <!-- container -->
</template>

<script>
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: {
    loading,
    "people-trail": () => import("@/components/ui/people-trail"),
    "purchase-materials": () =>
      import(
        "@/components/hagul/inventory/sales-orders/purchase-materials.vue"
      ),
    terminate: () =>
      import("@/components/hagul/inventory/sales-orders/terminate.vue")
  },
  computed: {
    itemsToPurchase() {
      return this.salesOrder.items.filter(
        (item) => item.quantity > item.material.stock
      );
    }
  },
  created() {
    this.setSalesOrder(this.$route.query.id);
  },
  data: () => ({
    loading: true,
    salesOrder: null,
    shouldRefresh: true
  }),
  head: () => ({
    title: "Sales Order Details · Hagul"
  }),
  meta: {
    pageName: "sales-orders.show"
  },
  methods: {
    async setSalesOrder(id) {
      const {
        detailedAssociations,
        salesOrders
      } = this.$store.state.hagul.inventory.salesOrders;
      this.salesOrder = salesOrders.find((salesOrder) => salesOrder.id == id);
      if (this.salesOrder && !this.shouldRefresh) {
        if (Array.isArray(this.salesOrder.items)) {
          return (this.loading = false);
        }
      }

      try {
        const response = await this.$axios.get("sales-orders/" + id, {
          params: { associations: detailedAssociations }
        });
        this.$store.commit(
          "hagul/inventory/salesOrders/setSalesOrder",
          response.data.salesOrder
        );
        this.salesOrder = this.salesOrder
          ? Object.assign({}, response.data.salesOrder)
          : response.data.salesOrder;

        this.loading = false;
        this.shouldRefresh = false;
        this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    updateSalesOrder() {
      this.shouldRefresh = true;
      this.setSalesOrder(this.salesOrder.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route(to, from) {
      this.setSalesOrder(to.query.id);
    }
  }
};
</script>
