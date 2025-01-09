<template>
  <div>
    <span v-modal-open="'send-next-cycle-modal'" class="btn btn-sm btn-warning bd-0 mg-t-5">
      <i class="icon ion-android-send"></i> Send to Next Cycle
    </span>
    <v-modal ref="send-next-cycle-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'send-next-cycle-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Send to Next Cycle?</h4>
            <div id="send-next-cycle">
              <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="moveRequest()">
                <i class="icon ion-ios-checkmark-outline"></i> Confirm Send
              </v-button>

              <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'send-next-cycle-modal'"
                aria-label="Close" :disabled="disabled">
                <i class="icon ion-ios-close-outline"></i> Cancel
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
    moveRequest() {
      this.disabled = true;
      const job_schedule_id = this.jobSchedule.id;

      // Modify to send to next cycle
      this.$axios
        .put("maintenance-cycles/move-to-next-cycle", { job_schedule_id })
        .then((response) => {
          this.disabled = false;
          this.closeModal("send-next-cycle-modal");
          this.$emit("update");
          this.toast({ type: "info", title: "Job Schedule Moved to Next Cycle " });
        })
        .catch((error) => {
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
  props: ["jobSchedule"]
};
</script>
