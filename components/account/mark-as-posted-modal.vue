<template>
  <div class="mg-b-5">
    <span v-modal-open="'mark-as-posted-modal'">
      <slot>
        <span class="btn btn-sm btn-primary bd-0"> MARK AS POSTED </span>
      </slot>
    </span>
    <v-modal ref="mark-as-posted-modal" class="modal fade">
      <div role="document" class="modal-dialog modal-dialog-vertical-center">
        <div class="modal-content bd-0 tx-14">
          <div class="modal-header pd-x-20">
            <h6 class="tx-14 mg-b-0 tx-uppercase tx-inverse tx-bold">
              MARK AS POSTED
            </h6>
            <button
              type="button"
              data-dismiss="modal"
              aria-label="Close"
              class="close"
              v-modal-close="'mark-as-posted-modal'"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <form id="purchase-order-form" class="form-layout">
            <div class="modal-body pd-20">
              <h4 class="tx-center">
                Are you sure you want to post this to accounts?
              </h4>
            </div>
            <div class="modal-footer justify-content-center">
              <!-- <div>{{ this }}</div> -->
              <v-button
                :disabled="modalLoading"
                type="button"
                class="btn btn-primary"
                @click="markAsPosted()"
                >SUBMIT</v-button
              >
              <button
                type="button"
                data-dismiss="modal"
                class="btn btn-danger"
                v-modal-close="'mark-as-posted-modal'"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div> </v-modal
    ><!-- mark as posted modal -->
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
  data: function() {
    return {
      modalLoading: false,
      purchaseOrder: null,
    }
  },
  methods: {
    async markAsPosted() {
      this.modalLoading = true;

      try {
        const response = await this.$axios.post(
          "purchase-orders/process/mark-as-posted",
          {
            purchase_order_id: this.purchaseOrderId
          }
        );

        this.modalLoading = false;
        this.purchaseOrder = response.data.purchaseOrder;
        this.$emit("updated", this);
        this.closeModal("mark-as-posted-modal");
      } catch (error) {
        console.log(error);
        this.modalLoading = false;
      }
    }
  },
  props: ["purchaseOrderId"],
  middleware: ["auth"],
  mixins: [authMixin, formMixin, modalMixin]
}
</script>
