<template>
  <div class="mg-b-5">
    <span v-modal-open="'stop-job-modal'">
      <slot>
        <span class="btn btn-warning bd-0">
          <i class="icon ion-stop pd-r-5 tx-14"></i>
          Stop Job
        </span>
      </slot>
    </span>
    <v-modal ref="stop-job-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'stop-job-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Stop Job?</h4>
            <form id="stop-job-form">
              <p class="mg-t-20 tx-20">Are you sure you want to stop job?</p>
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="stopJob()">
                  <i class="icon ion-ios-checkmark-outline"></i> Confirm
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'stop-job-modal'" aria-label="Close"
                  :disabled="disabled">
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
    text: "",
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    stopJob() {
      if (!this.validateForm("stop-job-form")) return false;

      this.disabled = true;
      const { text } = this;
      const work_request_id = this.workRequest.id;

      this.$axios
        .post("work-requests/stop-job", { text, work_request_id })
        .then((response) => {
          this.disabled = false;
          this.text = "";
          this.closeModal("stop-job-modal");
          this.$emit("update");
          this.toast({ type: "info", title: "Job stopped" });
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
