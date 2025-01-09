<template>
  <div>
    <span v-modal-open="'seek-clarification-modal'" class="btn btn-sm btn-warning bd-0">
      <i class="icon ion-help-circled"></i> Seek Clarification
    </span>
    <v-modal ref="seek-clarification-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'seek-clarification-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Seek Clarification?</h4>
            <form id="seek-clarification-form">
              <div class="form-layout-footer">
                <div class="form-group">
                  <label class="form-control-label">
                    Comment
                    <span class="tx-danger">*</span>
                  </label>
                  <div class="input-group pd-x-20">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <i class="icon ion-ios-chatbubble tx-16 lh-0 op-6"></i>
                      </span>
                    </div>
                    <textarea name="text" v-model="text" class="form-control" required></textarea>
                  </div>
                  <small class="tx-bold tx-danger" v-if="validationErrors.text" v-text="validationErrors.text"></small>
                </div>
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled"
                  @click="seekClarification()">
                  <i class="icon ion-ios-checkmark-outline"></i> Submit
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'seek-clarification-modal'"
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
    text: "",
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    seekClarification() {
      if (!this.validateForm("seek-clarification-form")) return false;

      this.disabled = true;
      const client_request_id = this.clientRequest.id;
      const text = this.text;

      this.$axios
        .post("client-requests/seek-clarification", { client_request_id, text })
        .then((response) => {
          this.disabled = false;
          this.closeModal("seek-clarification-modal");
          this.$emit("update");
          this.toast({ type: "info", title: "Clarification Request Sent" });
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
            // response);
            this.toast({
              type: "danger",
              title: "Network Error. Please Contact Support"
            });
          }
        });
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["clientRequest"]
};
</script>
