<template>
  <div class="mg-b-5">
    <span v-modal-open="'terminate-modal'">
      <slot>
        <span class="btn btn-danger bd-0">
          <i class="icon ion-ios-close-outline tx-14"></i>
          Terminate Job
        </span>
      </slot>
    </span>
    <v-modal ref="terminate-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'terminate-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Terminate Job?</h4>
            <form id="terminate-form">
              <div class="form-group">
                <label for="text" class="form-control-label">
                  Reason
                  <span class="tx-danger">*</span>
                </label>
                <textarea name="text" v-model="text" class="form-control"></textarea>
              </div>
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="terminateJob()">
                  <i class="icon ion-ios-checkmark-outline"></i> Confirm
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'terminate-modal'"
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
    text: null,
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    terminateJob() {
      if (!this.validateForm("terminate-form")) return false;

      this.disabled = true;
      const { text } = this;
      const work_request_id = this.workRequest.id;

      this.$axios
        .post("work-requests/terminate", { text, work_request_id })
        .then((response) => {
          this.disabled = false;
          this.text = "";
          this.closeModal("terminate-modal");
          this.$emit("update");
          this.toast({ type: "info", title: "Work Request Terminated" });
        })
        .catch((error) => {
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
            response;
            this.toast({
              type: "danger",
              title: "Network Error. Please Contact Support"
            });
          }
        });
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["workRequest"]
};
</script>
