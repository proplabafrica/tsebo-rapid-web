<template>
  <div v-if="salesOrder.status.code == 'in-stock'">
    <button
      class="btn btn-primary bd-0"
      v-modal-open="'dispatch-sales-orders-modal'"
    >
      DISPATCH
    </button>

    <v-modal ref="dispatch-sales-orders-modal">
      <div class="modal-dialog wd-600" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button
              type="button"
              class="close"
              v-modal-close="'dispatch-sales-orders-modal'"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h3 class="mg-b-20 pd-t-60 pd-b-40">
              Dispatch Sales Order #{{ salesOrder.code }}?
            </h3>
            <div class="form-layout-footer">
              <v-button
                class="btn btn-success bd-0 pd-x-25 mg-x-10"
                :disabled="disabled"
                @click="dispatchMaterials()"
              >
                <i class="icon ion-ios-checkmark-outline"></i> CONFIRM
              </v-button>
              <button
                type="button"
                class="btn btn-danger pd-x-25"
                v-modal-close="'dispatch-sales-orders-modal'"
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
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";

export default {
  components: { vButton, vModal },
  data: () => ({
    disabled: false
  }),
  methods: {
    dispatchMaterials() {
      this.disabled = true;
      const sales_order_id = this.salesOrder.id;
      this.$axios
        .post("sales-orders/dispatch", { sales_order_id })
        .then(response => {
          this.disabled = false;
          this.closeModal("dispatch-sales-orders-modal");
          this.$emit("update");
        })
        .catch(error => {
          this.disabled = false;
          console.log(error);
        });
    }
  },
  mixins: [modalMixin],
  props: ["salesOrder"]
};
</script>
