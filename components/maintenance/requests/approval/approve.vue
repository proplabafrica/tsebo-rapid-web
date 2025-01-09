<template>
  <div>
    <span v-modal-open="'approve-request-modal'" class="btn btn-sm btn-success bd-0">
      <i class="icon ion-ios-checkmark-outline"></i> Approve Request
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
              <div class="form-group">
                <label for="maintenance_type" class="form-control-label">Maintenenace Type <span
                    class="tx-danger">*</span></label>
                <select name="maintenance_type" v-model="workRequest.maintenance_type" class="form-control">
                  <option value="corrective">Corrective</option>
                  <option value="project">Project</option>
                </select>
              </div>
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
    this.workRequest.name = this.clientRequest.name;
  },
  data: () => ({
    workRequest: {
      maintenance_type: "corrective",
      name: null
    },
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    approveRequest() {
      if (!this.validateForm("approve-request-form")) return false;

      this.disabled = true;

      const client_request_id = this.clientRequest.id;
      const { maintenance_type, name } = this.workRequest;
      const unit_id = this.clientRequest.unit_id;

      this.$axios
        .post("work-requests", {
          client_request_id,
          maintenance_type,
          name,
          unit_id
        })
        .then(response => {
          this.disabled = false;
          this.closeModal("approve-request-modal");
          this.$store.commit("maintenance/clientRequests/toggleRefresh");
          this.$router.push(
            `/maintenance/requests/details?id=${response.data.workRequest.id}`
          );
        })
        .catch(error => {
          console.log(error);
          this.disabled = false;
          const response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else if (response && response.status && response.status == 429) {
            this.validationErrors.email = response.statusText;
          } else {}
        });
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["clientRequest"]
};
</script>
