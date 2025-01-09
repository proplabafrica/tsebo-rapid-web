<template>
  <div class="d-inline">
    <span v-modal-open="'approve-request-modal'" class="btn btn-primary bd-0">
      <i class="icon ion-ios-checkmark-outline"></i> Approve
    </span>
    <v-modal ref="approve-request-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'approve-request-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Approve Request?</h4>
            <form id="approve-request-form">
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="approveRequest()">
                  <i class="icon ion-ios-checkmark-outline"></i> Approve
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'approve-request-modal'"
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
  created() {
    this.floatRequest.name = this.floatRequest.name;
  },
  data: () => ({
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    async approveRequest() {
      if (!this.validateForm("approve-request-form")) return false;

      this.disabled = true;

      const float_request_id = this.floatRequest.id;

      try {
        const response = await this.$axios.post("float-requests/approve", {
          float_request_id
        });
        this.disabled = false;
        this.closeModal("approve-request-modal");
        this.$store.commit("maintenance/floatRequests/toggleRefresh");
        this.$emit("update");
        this.toast({ type: "info", title: "Float Request Approved" });
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
          this.toast({
            type: "danger",
            title: "Network Error. Please Contact Support"
          });
        }
      }
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["floatRequest"]
};
</script>
