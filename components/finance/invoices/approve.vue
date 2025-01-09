<template>
  <div class="d-inline">
    <span v-modal-open="'approve-invoice-modal'" class="btn btn-primary bd-0">
      <i class="icon ion-ios-checkmark-outline"></i> APPROVE INVOICE
    </span>
    <v-modal ref="approve-invoice-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'approve-invoice-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Approve Invoice?</h4>
            <form id="approve-invoice-form">
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="approveInvoice()">
                  <i class="icon ion-ios-checkmark-outline"></i> Approve
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'approve-invoice-modal'"
                  aria-label="Close" :disabled="disabled">
                  <i class="icon ion-ios-close-outline"></i> Cancel
                </button>
              </div>
            </form>
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
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { vButton, vModal },
  data: () => ({
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    async approveInvoice() {
      if (!this.validateForm("approve-invoice-form")) return false;
      this.disabled = true;

      const invoice_id = this.invoice.id;
      const item_id = this.invoice.items.map((item) => item.id);
      const amount = this.invoice.items.map((item) => item.amount);

      try {
        const response = await this.$axios.post(
          "invoices/store-client-response",
          {
            invoice_id,
            item_id,
            amount
          }
        );
        this.disabled = false;
        this.closeModal("approve-invoice-modal");
        this.$emit("update");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {
          // response);
          this.toast({
            type: "danger",
            title: "Network Error. Please Contact Support"
          });
        }
      }
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["invoice"]
};
</script>
