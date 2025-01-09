<template>
  <div class="mg-b-5">
    <span v-modal-open="'reactivate-modal'">
      <slot>
        <span class="btn btn-sm btn-danger bd-0">
          <i class="icon ion-trash-a"></i> REACTIVATE</span
        >
      </slot>
    </span>
    <v-modal ref="reactivate-modal">
      <div class="modal-dialog modal-dialog-vertical-center" role="document">
        <div class="modal-content bd-0 tx-14">
          <div class="modal-header pd-x-20">
            <h6 class="tx-14 mg-b-0 tx-uppercase tx-inverse tx-bold">
              REACTIVATE
            </h6>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="reactivate-form" class="form-layout">
            <div class="modal-body pd-20">
              <h4 class="tx-center">
                Are you sure you want to Reactivate this Purchase Order?
              </h4>

              <div class="pd-20 row">
                <div class="form-group col-12">
                  <label for="payment_details" class="form-group-label">
                    Reason <span class="tx-danger">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    cols="50"
                    class="form-control"
                    required
                    v-model="description"
                  ></textarea>
                  <span
                    v-if="validationErrors.description"
                    class="tx-danger"
                    role="alert"
                  >
                    <small>
                      <strong v-text="validationErrors.description"></strong>
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
                @click="reactivate()"
                >SUBMIT</v-button
              >
              <button type="button" class="btn btn-danger" data-dismiss="modal">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </v-modal>
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
      purchaseOrder: null,
      description: null,
      validationErrors: {
        description: null
      }
    };
  },
  methods: {
    async reactivate() {
      if (!this.validateForm("reactivate-form", "validationErrors"))
        return false;
      this.modalLoading = true;

      try {
        const response = await this.$axios.post(
          "purchase-orders/process/reactivate",
          {
            purchase_order_id: this.purchaseOrderId,
            description: this.description
          }
        );

        this.modalLoading = false;
        this.purchaseOrder = response.data.purchaseOrder;
        this.$emit("updated", this);
        this.closeModal("reactivate-modal");
      } catch (error) {
        console.log(error);
        this.modalLoading = false;
      }
    }
  },
  props: ["purchaseOrderId"],
  middleware: ["auth"],
  mixins: [authMixin, formMixin, modalMixin]
};
</script>
