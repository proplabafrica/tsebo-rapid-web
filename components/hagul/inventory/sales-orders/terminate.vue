<template>
  <div>
    <span class="btn btn-danger" v-modal-open="'terminate-sales-order-modal'">
      <i class="icon ion-ios-close-outline"></i> Terminate
    </span>
    <v-modal ref="terminate-sales-order-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button
              type="button"
              class="close"
              v-modal-close="'terminate-sales-order-modal'"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <span class="tx-100 tx-warning lh-1 mg-t-20 d-inline-block"
              >&#9888;</span
            >
            <h4 class="mg-b-20">
              Terminate {{ salesOrder.name || salesOrder.code }}?
            </h4>
            <v-button
              type="button"
              class="btn btn-danger pd-x-25"
              :disabled="disable"
              @click="terminate()"
            >
              <i class="icon ion-ios-checkmark-outline"></i> Terminate
            </v-button>
            <button
              type="button"
              class="btn btn-primary pd-x-25"
              v-modal-close="'terminate-sales-order-modal'"
              aria-label="Close"
              :disabled="disable"
            >
              <i class="icon ion-ios-close-outline"></i> Cancel
            </button>
          </div>
          <!-- modal-body -->
        </div>
        <!-- modal-content -->
      </div>
      <!-- modal-dialog -->
    </v-modal>
  </div>
  <!-- form-layout-footer -->
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";

export default {
  components: { vButton, vModal },
  data: () => ({
    disable: false
  }),
  methods: {
    async terminate() {
      this.disable = true;
      const sales_order_id = this.salesOrder.id;

      try {
        const response = await this.$axios.post("sales-orders/terminate", {
          sales_order_id
        });
        this.disable = false;
        this.closeModal("terminate-sales-order-modal");
        this.$emit("update");
      } catch (error) {
        console.log(error);
      }
    }
  },
  mixins: [modalMixin],
  props: ["salesOrder"]
};
</script>
