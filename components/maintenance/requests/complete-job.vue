<template>
  <div class="mg-b-5">
    <span v-modal-open="'complete-job-modal'">
      <slot>
        <span class="btn btn-primary bd-0">
          <i class="icon ion-ios-checkmark-outline"></i> Complete Job
        </span>
      </slot>
    </span>
    <v-modal ref="complete-job-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'complete-job-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Mark Job As Complete?</h4>
            <form id="complete-job-form">
              <div class="form-group pd-x-20" v-if="false">
                <label class="form-control-label">
                  Failure Type
                  <span class="tx-danger">*</span>
                </label>
                <select class="form-control" name="failure_type_id" v-model="jobDetails.failure_type_id">
                  <option :value="null">Select one</option>
                  <option v-for="type in failureTypes" :key="type.id" :value="type.id" v-text="type.name"></option>
                </select>
                <small class="tx-bold tx-danger" v-if="validationErrors.failure_type_id"
                  v-text="validationErrors.failure_type_id"></small>
              </div>
              <div class="form-group">
                <label class="form-control-label">Comment
                  <span class="tx-danger">*</span>
                </label>
                <!-- <div class="input-group pd-x-20"> -->
                <!-- <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="icon ion-ios-chatbubble tx-16 lh-0 op-6"></i>
                    </span>
                  </div> -->
                <textarea name="text" v-model="jobDetails.text" class="form-control"></textarea>
                <!-- </div> -->
                <small class="tx-bold tx-danger" v-if="validationErrors.text" v-text="validationErrors.text"></small>
              </div>
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="completeJob()">
                  <i class="icon ion-ios-checkmark-outline"></i> Confirm
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'complete-job-modal'"
                  aria-label="Close" :disabled="disabled">
                  <i class="icon ion-ios-close-outline"></i> Cancel
                </button>
              </div>
            </form>
          </div>
          <!--  -->
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
import slaMixin from "@/mixins/performance/sla";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

const getInitialData = () => ({
  jobDetails: {
    rating: null,
    text: ""
  },
  disabled: false,
  validationErrors: {}
});

export default {
  components: { vButton, vModal },
  // data: () => getInitialData(),
  data: () => ({
    jobDetails: {
      rating: null,
      text: ""
    },
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    async completeJob() {
      if (!this.validateForm("complete-job-form")) return false;

      this.disabled = true;
      const { rating, text } = this.jobDetails;
      const work_request_id = this.workRequest.id;
      try {
        const response = await this.$axios.post("work-requests/complete-job", {
          text,
          work_request_id
        });
        this.disabled = false;

        var { failureTypes } = this;
        var initialData = Object.assign(getInitialData(), { failureTypes });
        Object.assign(this.$data, initialData);
        this.closeModal("complete-job-modal");
        this.$emit("update");
        this.toast({ type: "info", title: "Job Marked As Complete" });
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
          // response);
          this.toast({
            type: "danger",
            title: "Network Error. Please Contact Support"
          });
        }
      }
    }

    // .catch((error) => {
  },
  mixins: [slaMixin, formMixin, modalMixin],
  props: ["workRequest"]
};
</script>
