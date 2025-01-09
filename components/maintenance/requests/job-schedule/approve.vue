<template>
  <div>
    <span
      v-modal-open="`approve-request-modal`"
      class="btn btn-sm btn-success bd-0"
    >
      <i class="icon ion-ios-checkmark-outline"></i>Approve Request
    </span>
    <v-modal ref="approve-request-modal">
      <div class="modal-dialog wd-300 md-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button
              class="close"
              type="button"
              v-modal-close="`approve-request-modal`"
              aria-label="Close"
            >
              <span arial-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Approve Request?</h4>
            <form id="approve-request-form">
              <div class="form-group">
                <label for="maintenance_type" class="form-control-label"
                  >Maintenance Type <span class="tx-danger">*</span></label
                >
                <select
                  name="maintenance_type"
                  v-model="workRequest.maintenance_type"
                  class="form-control"
                >
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="project">project</option>
                </select>
              </div>
              <div class="form-layout-footer">
                <v-button
                  type="button"
                  class="btn btn-primary pd-x-25"
                  :disabled="disabled"
                  @click="approveRequest()"
                >
                  <i class="icon ion-ios-checkmark-outline"></i> Approve
                </v-button>
                <button
                  type="button"
                  class="btn btn-danger pd-x-25"
                  v-modal-close="'approve-request-modal'"
                  aria-label="Close"
                  :disabled="disabled"
                >
                  <i class="icon ion-ios-close-outline"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </v-modal>
  </div>  
</template>

<script>

import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal"

export default {
  components: {
    vButton, vModal
  },
  created() {
    this.workRequest.name = this.jobSchedule.plan.name;
  },
  data: () => ({
    workRequest: {
      maintenance_type: "preventive",
      name: null,
    },
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    approveRequest() {
      if (!this.validateForm("approve-request-form")) return false;

      this.disabled = true;

      const job_schedule_id = this.jobSchedule.id;

      this.$axios
        .post("job-schedules/activate", {
          job_schedule_id,
        })
        .then (response => {
          this.disabled = false;
          this.closeModal("approve-request-modal");
          this.$store.commit("maintenance/jobSchedules/toggleRefresh");
          this.$router.push(
            `/maintenance/requests/details?id=${response.data.workRequest.id}`
          )
        })
        .catch((error) => {
          console.log(error.response)
        });
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["jobSchedule"]
}

</script>
