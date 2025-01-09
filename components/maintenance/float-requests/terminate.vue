<template>
  <div class="d-inline">
    <span v-modal-open="'terminate-request-modal'" class="btn btn-danger bd-0">
      <i class="icon ion-ios-close-outline"></i> Terminate
    </span>
    <v-modal ref="terminate-request-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'terminate-request-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Terminate Request?</h4>

            <div class="form-group col-md-12">
              <label for="description" class="form-control-label text-start">Kindly state the Reason why you are
                Terminating the Float Request...</label>
              <div class="custom-file">
                <textarea name="description" v-model="terminate.description" class="form-control"
                  placeholder="State Your Reason.."></textarea>
              </div>
              <small class="tx-bold tx-danger" v-if="validationErrors.list" v-text="validationErrors.list"></small>
            </div>
            <form id="terminate-request-form">
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled"
                  @click="terminateRequest()">
                  <i class="icon ion-ios-checkmark-outline"></i> Terminate
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'terminate-request-modal'"
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
    validationErrors: {},
    terminate: {
      description: "",
    },
    validationErrors: {
      list: "",
    },
  }),
  methods: {
    async terminateRequest() {
      if (!this.validateForm("terminate-request-form")) return false;

      if (!this.terminate.description) {
        this.validationErrors.list = "Sorry! kindly enter your reason for terminating your request"

      } else {
        this.validationErrors.list = ""

        this.disabled = true;

        const float_request_id = this.floatRequest.id;
        const text = this.terminate.description
        try {
          const response = await this.$axios.post("float-requests/terminate", {
            float_request_id,
            text
          });
          this.disabled = false;
          this.closeModal("terminate-request-modal");
          this.$store.commit("maintenance/floatRequests/toggleRefresh");
          this.$emit("update");
          this.toast({ type: "info", title: "Float Request Terminated" });
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

    }
  },
  mixins: [formMixin, modalMixin],
  props: ["floatRequest"]
};
</script>
