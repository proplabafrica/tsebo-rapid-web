<template>
  <div class="d-inline mg-b-5">
    <span v-modal-open="'reopen-request-modal'">
      <slot>
        <span class="btn btn-primary bd-0"> Upload JCF </span>
      </slot>
    </span>
    <v-modal ref="reopen-request-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'reopen-request-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Upload JCF</h4>
            <form id="start-job-form">
              <div class="form-group">
                <label class="form-control-label">Attachment (Max 2MB)</label>
                <div class="custom-file image-input">
                  <input type="file" accept="image/*" @change="
                    convertToBase64($event).then(data => {
                      jcf.file = data.file;
                      jcf.type = data.type;
                      jcf.file_name = data.file_name
                    })
                  " class="custom-file-input" title="Select an image 1MB or less" name="file" />
                  <label class="custom-file-label" for="customFile" v-text="jcf.file_name"></label>
                </div>
                <!-- custom-file -->
                <small class="tx-bold tx-danger" v-if="validationErrors.file" v-text="validationErrors.file"></small>
              </div>


              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-success pd-x-25" :disabled="disabled" @click="uploadJCF()">
                  <i class="icon ion-ios-checkmark-outline"></i> Upload
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'reopen-request-modal'"
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
  components: { starInput, vButton, vModal },
  data: () => ({
    disabled: false,
    loading: false,
    jcf: {
      file: '',
      type: '',
      file_name: ''
    },
    validationErrors: {}
  }),
  methods: {
    async uploadJCF() {
      if (!this.jcf.file) {
        this.validationErrors.file = 'Please upload a file';
        return
      }
      this.disabled = true;

      let workRequest = JSON.parse(JSON.stringify(this.workRequest));


      // reopenedRequest.returned_job_id = this.workRequest.id;
      // reopenedRequest.equipment_ids = this.workRequest.equipment.map(
      //   (equipment) => equipment.id
      // );

      try {
        const response = await this.$axios.post(
          "work-requests/upload-jcf",
          { work_request_id: workRequest.id, file: `${this.jcf.type},${this.jcf.file}` }
        );
        this.disabled = false;
        this.closeModal("reopen-request-modal");
        this.$router.push(
          `/maintenance/requests/details?id=${response.data.workRequest.id}`
        );
        this.$emit("update");
        this.toast({ type: "info", title: "JCF Uploaded!" });

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
        } else {}
      }
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["workRequest"]
};
</script>
