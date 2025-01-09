<template>
  <div class="d-inline mg-b-5">
    <span v-modal-open="'close-incident-modal'">
      <slot>
        <span class="btn btn-primary bd-0"> Close Incident </span>
      </slot>
    </span>
    <v-modal ref="close-incident-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'close-incident-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>

            <h4 class="mg-b-20">Close this Incident</h4>
            <form id="rate-job-form">
              <div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="tx-bold">Name:</span>
                  <span>{{ incident.reporter.name }}</span>
                </div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="tx-bold">Unit:</span>
                  <span>{{ incident.unit.name }}</span>
                </div>
                <div class="d-flex justify-content-between mb-1">
                  <span class="tx-bold">Date Logged:</span>
                  <span class="d-block">
                    <div>{{ incident.created_at | dateFormat }}</div>
                    <div class="text-right tx-inverse">
                      {{
                      new Date(incident.created_at).toLocaleTimeString(
                      "en-US"
                      )
                      }}
                    </div>
                  </span>
                </div>
                <div class="text-left mb-2">
                  <label class="form-control-label tx-bold">
                    Corrective Action Taken:
                    <span class="tx-danger">*</span>
                  </label>
                  <input type="text" class="form-control" v-model="incidentReportForm.actionTaken"
                    :name="`${incident.name}`" required />
                  <small class="tx-bold tx-danger" v-text="validationErrors[incident.name]"></small>
                </div>
                <div class="text-left mb-4">
                  <label class="form-control-label text-left tx-bold">
                    Description:
                    <span class="tx-danger">*</span>
                  </label>
                  <input type="text" class="form-control" v-model="incidentReportForm.actionDescription"
                    :name="`${incident.name}-description`" required />
                  <small class="tx-bold tx-danger" v-text="validationErrors[`${incident.name}-description`]"></small>
                </div>
              </div>
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="closeIncident()">
                  <i class="icon ion-ios-checkmark-outline"></i> Confirm
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'close-incident-modal'"
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
import starInput from "@/components/ui/star-input";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: {
    starInput,
    vButton,
    vModal,
    toast: () => import("@/components/ui/toast")
  },
  data: () => ({
    status: "closed",
    disabled: false,
    validationErrors: {},
    incidentReportForm: {
      actionTaken: "",
      actionDescription: ""
    }
  }),
  methods: {
    async closeIncident() {
      this.disabled = true;
      const status = this.status;
      const incident_report_id = this.incident.id;

      this.createIncidentForm();

      try {
        const response = await this.$axios.post(
          "incident-reports/close-incident",
          {
            status,
            incident_report_id
          },
          (error) => {
            console.log(error);
          }
        );
        this.disabled = false;
        this.closeModal("close-incident-modal");
        this.$emit("update");
        this.toast({ type: "info", title: "Incident Closed" });
      } catch (error) {
        this.toast({ type: "danger", title: "Unable to Close Incident" });
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
        }
      }
    },
    async createIncidentForm() {
      this.disabled = true;
      const incident_report_id = this.incident.id;

      const { actionTaken, actionDescription } = this.incidentReportForm;

      try {
        const response = await this.$axios.post("incident-report-forms", {
          action_taken: actionTaken,
          action_description: actionDescription,
          incident_report_id
        });
        this.disabled = false;
        this.$emit("update");
      } catch (error) {
        this.toast({ type: "danger", title: "Unable to Close Incident" });
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
        }
      }
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["incident"]
};
</script>
