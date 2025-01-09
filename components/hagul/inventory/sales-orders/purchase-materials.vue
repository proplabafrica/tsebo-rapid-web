<template>
  <div>
    <span
      v-modal-open="'purchase-materials-modal'"
      class="btn btn-primary bd-0"
    >
      <i class="icon ion-ios-pricetag"></i> PURCHASE MATERIALS
    </span>
    <v-modal ref="purchase-materials-modal">
      <div class="modal-dialog modal-lg wd-700" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button
              type="button"
              class="close"
              v-modal-close="'purchase-materials-modal'"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h5 class="mg-b-20">Review Items</h5>
            <div class="table-responsive tx-left">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tr v-for="item in itemsToPurchase" :key="item.id">
                  <td>
                    <nuxt-link
                      :to="`/hagul/inventory/materials/details?id=${item.material.id}`"
                      class="tx-inverse tx-14 tx-medium d-block"
                      v-text="item.material.name"
                    ></nuxt-link>
                    <span v-if="item.material.code" class="tx-11 d-block"
                      >#{{ item.material.code }}</span
                    >
                    <span class="tx-11 d-block"
                      >Stock: {{ item.material.stock }}</span
                    >
                  </td>
                  <td>
                    <span v-text="item.quantity - item.material.stock"></span>
                  </td>
                </tr>
              </table>
            </div>
            <!-- table-responsive -->
            <div class="form-layout-footer tx-center mg-t-20">
              <v-button
                class="btn btn-primary bd-0"
                :disabled="disabled"
                @click="purchaseMaterials()"
              >
                <i class="icon ion-ios-checkmark-outline"></i> Confirm
              </v-button>
              <button
                type="button"
                class="btn btn-danger pd-x-25"
                v-modal-close="'purchase-materials-modal'"
                aria-label="Close"
                :disabled="disabled"
              >
                <i class="icon ion-ios-close-outline"></i> Cancel
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
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";

export default {
  components: { loading, vButton, vModal },
  computed: {
    itemsToPurchase() {
      return this.salesOrder.items.filter(
        (item) => item.quantity > item.material.stock
      );
    },
    workRequests() {
      if (
        !this.salesOrder &&
        !Object.keys(this.salesOrder).length &&
        !this.salesOrder.workRequests.length
      )
        return null;
      return this.salesOrder.workRequests;
    }
  },
  data: () => ({
    disabled: false
  }),
  methods: {
    purchaseMaterials() {
      this.disabled = true;
      const sales_order_id = this.salesOrder.id;
      const work_request_id = this.workRequests[0].id;
      this.$axios
        .post("sales-orders/store-tender-process", { sales_order_id, work_request_id })
        .then((response) => {
          this.disabled = false;
          this.closeModal("purchase-materials-modal");
          this.$router.push(
            `/hagul/purchase/tender-processes/send-rfq?id=${response.data.tenderProcess.id}`
          );
        })
        .catch((error) => {
          this.disabled = false;
          console.log(error);
        });
    }
  },
  mixins: [modalMixin],
  props: ["salesOrder"]
};
</script>
