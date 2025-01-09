<template>
  <div class="mg-b-5">
    <span v-modal-open="'record-payment-modal'">
      <slot>
        <span class="btn btn-sm btn-primary bd-0"> RECORD PAYMENT</span>
      </slot>
    </span>
    <v-modal ref="record-payment-modal" class="modal fade">
      <div class="modal-dialog modal-dialog-vertical-center" role="document">
        <div class="modal-content bd-0 tx-14">
          <div class="modal-header pd-x-20">
            <h6 class="tx-14 mg-b-0 tx-uppercase tx-inverse tx-bold">
              RECORD PAYMENT
            </h6>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              v-modal-close="'record-payment-modal'"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="record-payment-form" class="form-layout">
            <div class="modal-body pd-20">
              <div class="pd-20 row">
                <div class="form-group col-12">
                  <label for="payment_details" class="form-group-label">
                    Enter Amount
                    <span class="tx-danger">*</span> (&#8358;<span>{{
                      amount
                    }}</span
                    >)
                  </label>
                  <input
                    name="amount"
                    type="number"
                    step="any"
                    :max="amountToPay"
                    v-model="amount"
                    class="form-control"
                    required
                  />
                  <span
                    v-if="validationErrors.amount"
                    class="tx-danger"
                    role="alert"
                  >
                    <small>
                      <strong v-text="validationErrors.amount"></strong>
                    </small>
                  </span>
                </div>
                <div class="form-group col-12">
                  <label for="payment_details" class="form-group-label">
                    Transaction Date <span class="tx-danger">*</span>
                  </label>
                  <input
                    name="transaction_date"
                    type="date"
                    class="form-control"
                    required
                    v-model="transactionDate"
                  />
                  <span
                    v-if="validationErrors.transaction_date"
                    class="tx-danger"
                    role="alert"
                  >
                    <small>
                      <strong
                        v-text="validationErrors.transaction_date"
                      ></strong>
                    </small>
                  </span>
                </div>
                <div class="form-group col-12">
                  <label for="payment_details" class="form-group-label">
                    Enter Payment Details <span class="tx-danger">*</span>
                  </label>
                  <textarea
                    name="payment_details"
                    rows="3"
                    cols="50"
                    class="form-control"
                    required
                    v-model="payment_details"
                  ></textarea>
                  <span
                    v-if="validationErrors.payment_details"
                    class="tx-danger"
                    role="alert"
                  >
                    <small>
                      <strong v-text="validationErrors.payment_details"></strong>
                    </small>
                  </span>
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-center">
              <v-button
                :disabled="modalLoading"
                type="button"
                class="btn btn-primary"
                @click="recordPayment()"
                >SUBMIT</v-button
              >
              <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
                v-modal-close="'record-payment-modal'"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div> </v-modal
    ><!-- record payment modal -->
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: {
    loading,
    vButton,
    vModal
  },
  data: function () {
    return {
      modalLoading: false,
      amount: null,
      payment_details: null,
      transactionDate: null,
      validationErrors: {
        description: null,
        transactionDetails: null,
        transactionDate: null
      }
    };
  },
  methods: {
    async recordPayment() {
      if (!this.validateForm("record-payment-form", "validationErrors"))
        return false;
      this.modalLoading = true;

      try {
        await this.$axios.post(
          "purchase-orders/process/record-payment",
          {
            purchase_order_id: this.purchaseOrder.id,
            payment_details: this.payment_details,
            amount: this.amount,
            transaction_date: this.transactionDate
          }
        );

        this.modalLoading = false;
        this.$emit("updated", this);
        this.closeModal("record-payment-modal");
        this.toast({
          type: "success",
          title: "Payment recorded",
        });
      } catch (error) {
        console.log(error);
        this.modalLoading = false;
        this.toast({
          type: "danger",
          title: error.message,
        });

      }
    }
  },
  props: ["purchaseOrder", "amountToPay"],
  middleware: ["auth"],
  mixins: [authMixin, formMixin, modalMixin]
};
</script>
