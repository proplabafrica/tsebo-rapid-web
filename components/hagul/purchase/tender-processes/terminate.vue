<template>
  <div>
    <span
      class="btn btn-danger"
      v-modal-open="'terminate-tender-process-modal'"
    >
      <i class="icon ion-ios-close-outline"></i> Terminate
    </span>
    <v-modal ref="terminate-tender-process-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <form id="terminate-form" class="form-layout">
            <div class="modal-body tx-center pd-y-20 pd-x-20">
              <button
                type="button"
                class="close"
                v-modal-close="'terminate-tender-process-modal'"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <span class="tx-100 tx-warning lh-1 mg-t-20 d-inline-block"
                >&#9888;</span
              >
              <h4 class="mg-b-20">
                Terminate {{ tenderProcess.name || tenderProcess.code }}?
              </h4>
              <div class="pd-20 row">
                <div class="form-layout-footer">
                  <div class="form-group col-12">
                    <label for="payment_details" class="form-group-label">
                      Reason <span class="tx-danger">*</span>
                    </label>
                    <textarea
                      name="reason"
                      rows="3"
                      cols="50"
                      class="form-control"
                      required
                      v-model="reason"
                    ></textarea>
                    <span
                      v-if="validationErrors.reason"
                      class="tx-danger"
                      role="alert"
                    >
                      <small>
                        <strong v-text="validationErrors.reason"></strong>
                      </small>
                    </span>
                  </div>
                  <v-button
                    type="button"
                    class="btn btn-danger pd-x-25"
                    :disabled="disable"
                    @click="terminate()"
                  >
                    <i class="icon ion-ios-checkmark-outline"></i> Terminate
                  </v-button>
                  <button
                    type="button"
                    class="btn btn-primary pd-x-25"
                    v-modal-close="'terminate-tender-process-modal'"
                    aria-label="Close"
                    :disabled="disable"
                  >
                    <i class="icon ion-ios-close-outline"></i> Cancel
                  </button>
                </div>
              </div>
            </div>
            <!-- modal-body -->
          </form>
          <!-- form -->
        </div>
        <!-- modal-content -->
      </div>
      <!-- modal-dialog -->
    </v-modal>
  </div>
  <!-- form-layout-footer -->
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import formMixin from "@/mixins/forms";

export default {
  components: { vButton, vModal },
  data: () => ({
    disable: false,
    reason: "",
    validationErrors: {
      reason: null
    }
  }),
  methods: {
    async terminate() {
      if (!this.validateForm("terminate-form", "validationErrors"))
        return false;
      this.disable = true;
      const tender_process_id = this.tenderProcess.id;
      const reason = this.reason;

      try {
        const response = await this.$axios.post("tender-processes/terminate", {
          tender_process_id,
          reason
        });
        this.disable = false;
        this.closeModal("terminate-tender-process-modal");
        this.$emit("update");
      } catch (error) {
        console.log(error);
      }
    }
  },
  mixins: [modalMixin, formMixin],
  props: ["tenderProcess"]
};
</script>
