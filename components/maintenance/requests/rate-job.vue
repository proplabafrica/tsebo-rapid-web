<template>
  <div class="d-inline mg-b-5">
    <span v-modal-open="'rate-job-modal'">
      <slot>
        <span class="btn btn-primary bd-0">
          Rate Job
          <i class="icon ion-ios-star tx-14"></i>
        </span>
      </slot>
    </span>
    <v-modal ref="rate-job-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'rate-job-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Rate Job</h4>
            <form id="rate-job-form">
              <star-input class="tx-40 mg-10" :rangeArray="[1, 2, 3, 4, 5]" v-model="rating.rating" />
              <div class="form-group">
                <label class="form-control-label">Remark</label>
                <div class="input-group pd-x-20">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="icon ion-ios-chatbubble tx-16 lh-0 op-6"></i>
                    </span>
                  </div>
                  <textarea name="remark" v-model="rating.remark" class="form-control"></textarea>
                </div>
                <small class="tx-bold tx-danger" v-if="validationErrors.remark"
                  v-text="validationErrors.remark"></small>
              </div>
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="rateJob()">
                  <i class="icon ion-ios-checkmark-outline"></i> Confirm
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'rate-job-modal'" aria-label="Close"
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
import starInput from "@/components/ui/star-input";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { starInput, vButton, vModal },
  data: () => ({
    rating: {
      rating: null,
      remark: null
    },
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    async rateJob() {
      if (!this.validateForm("rate-job-form")) return false;

      this.disabled = true;
      const { rating, remark } = this.rating;
      const work_request_id = this.workRequest.id;

      try {
        const response = await this.$axios.post("work-requests/rate-job", {
          rating,
          remark,
          work_request_id
        });
        this.disabled = false;
        this.closeModal("rate-job-modal");
        this.rating = null;
        this.$emit("update");
        this.toast({ type: "info", title: "Job Rating Submitted" });
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
          this.toast({
            type: "danger",
            title: "Network Error. Please Contact Support"
          });
        }
      }
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["workRequest"]
};
</script>
