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
        <li class="breadcrumb-item">Confirm Delivery</li>
      </ol>
      <h6 class="slim-pagetitle">Confirm Delivery</h6>
    </div>
    <!-- slim-pageheader -->

    <div v-if="!loading">
      <div v-if="salesOrder.status.code == 'dispatched'">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Material</th>
                <th>Quantity</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tr v-for="item in salesOrder.items" :key="item.id">
              <td>
                <nuxt-link
                  :to="`/hagul/inventory/materials/${item.material.id}`"
                  class="tx-inverse tx-14 tx-medium d-block"
                  v-text="item.material.name"
                ></nuxt-link>
                <span v-if="item.material.code" class="tx-11 d-block"
                  >#{{ item.material.code }}</span
                >
              </td>
              <td>
                <span v-text="item.quantity"></span>
              </td>
              <td>
                <span v-if="item.material.stock" class="tx-11 d-block">{{
                  item.material.stock
                }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="1" rowspan="4" class="valign-middle">
                <label class="section-label-sm tx-gray-500">Sales Order</label>
                <div class="media">
                  <div class="media-body">
                    <nuxt-link
                      :to="`/hagul/inventory/sales-orders/details?id=${salesOrder.id}`"
                    >
                      <h5
                        class="card-profile-name"
                        v-text="'#' + salesOrder.code"
                      ></h5>
                    </nuxt-link>
                    <nuxt-link
                      class="btn btn-primary btn-sm bd-0 pd-x-25 mg-x-10"
                      v-if="dispatchedAt"
                      :to="`/hagul/inventory/sales-orders/print-pick-slip?id=${salesOrder.id}`"
                    >
                      <i class="icon ion-ios-printer-outline"></i> Print Pick
                      Slip
                    </nuxt-link>
                    <span class="card-profile-position d-block">
                      <span v-text="salesOrder.type.name + ' for'"></span>
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
                    </span>
                  </div>
                  <!-- media-body -->
                </div>
                <!-- media -->
              </td>
              <td
                class="tx-right tx-uppercase tx-bold tx-inverse"
                colspan="1"
              ></td>
              <td colspan="1" class="tx-right"></td>
            </tr>
          </table>
        </div>
        <!-- table-responsive -->
        <div class="form-layout-footer tx-center mg-t-20">
          <button
            class="btn btn-primary bd-0"
            :disabled="disabled"
            v-modal-open="'confirm-delivery-modal'"
          >
            CONFIRM DELIVERY
          </button>
        </div>

        <v-modal ref="confirm-delivery-modal">
          <div class="modal-dialog wd-600" role="document">
            <div class="modal-content tx-size-sm">
              <div class="modal-body tx-center pd-y-20 pd-x-20">
                <button
                  type="button"
                  class="close"
                  v-modal-close="'confirm-delivery-modal'"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <h3 class="mg-b-20 pd-t-60 pd-b-40">
                  Confirm Item Delivery #{{ salesOrder.code }}?
                </h3>
                <div class="form-layout-footer">
                  <v-button
                    class="btn btn-success bd-0 pd-x-25 mg-x-10"
                    :disabled="disabled"
                    @click="confirmDelivery()"
                  >
                    <i class="icon ion-ios-checkmark-outline"></i> CONFIRM
                  </v-button>
                  <button
                    type="button"
                    class="btn btn-danger pd-x-25"
                    v-modal-close="'confirm-delivery-modal'"
                    aria-label="Close"
                    :disabled="disabled"
                  >
                    <i class="icon ion-ios-close-outline"></i> CANCEL
                  </button>
                </div>
              </div>
              <!-- modal-body -->
            </div>
            <!-- modal-content -->
          </div>
          <!-- modal-dialog -->
        </v-modal>
      </div>
      <static-error
        v-else
        :error="{ title: 'Cannot Confirm Delivery' }"
        :redirect="{
          route: `/hagul/inventory/sales-orders/details?id=${salesOrder.id}`,
          text: 'Go To Sales Order'
        }"
      />
    </div>
    <loading v-else />
  </div>
  <!-- container -->
</template>

<script>
import loading from "@/components/ui/loading";
import staticError from "@/components/ui/static-error";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading, staticError, vButton, vModal },
  computed: {
    dispatchedAt() {
      const dispatchLog = this.salesOrder.logs.find(
        (log) => log.status.code == "dispatched"
      );
      if (!dispatchLog) return false;
      return dispatchLog.created_at;
    },
    stockIsSufficient() {
      var stockIsSufficient = true;
      for (const item of this.salesOrder.items) {
        if (item.material.stock < item.quantity) {
          stockIsSufficient = false;
        }
      }
      return stockIsSufficient;
    },
    total() {
      var total = 0;
      for (const item of this.salesOrder.items) {
        total += item.material.cost * item.quantity;
      }
      return total;
    }
  },
  created() {
    this.setSalesOrder(this.$route.query.id);
  },
  data: () => ({
    disabled: false,
    loading: true,
    salesOrder: null,
    shouldRefresh: true
  }),
  head: () => ({
    title: "Confirm Delivery · Hagul"
  }),
  meta: {
    pageName: "sales-orders.confirm-delivery"
  },
  methods: {
    setSalesOrder(id) {
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

      this.$axios
        .get("sales-orders/" + id, {
          params: {
            associations: detailedAssociations
          }
        })
        .then((response) => {
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateSalesOrder() {
      this.shouldRefresh = true;
      this.setSalesOrder(this.salesOrder.id);
    },
    confirmDelivery() {
      this.disabled = true;
      const sales_order_id = this.salesOrder.id;
      this.$axios
        .post("sales-orders/confirm-delivery", { sales_order_id })
        .then((response) => {
          this.disabled = false;
          this.closeModal("confirm-delivery-modal");
          this.$router.push(
            `/hagul/inventory/sales-orders/details?id=${this.salesOrder.id}`
          );
        })
        .catch((error) => {
          this.disabled = false;
          console.log(error);
        });
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, modalMixin],
  watch: {
    $route(to, from) {
      this.setSalesOrder(to.query.id);
    }
  }
};
</script>
