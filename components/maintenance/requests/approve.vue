<template>
  <div class="mg-b-5">
    <span v-modal-open="'approve-modal'">
      <slot>
        <span class="btn btn-primary bd-0">
          Approve Job
          <i class="icon ion-ios-close-outline tx-14"></i>
        </span>
      </slot>
    </span>
    <v-modal ref="approve-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'approve-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Approve Job?</h4>
            <form id="approve-form">
              <div class="form-group">
                <label for="text" class="form-control-label">
                  Comment
                  <span class="tx-danger">*</span>
                </label>
                <textarea name="text" v-model="request.text" class="form-control"></textarea>
              </div>
              <div class="form-group" v-if="false">
                <label class="form-control-label">
                  Select Technicians
                  <span class="tx-danger">*</span>
                </label>
                <v-select aria-multiselectable class="form-control" label="name" multiple
                  placeholder="Select Technicians" selectOnTab :options="technicians" v-model="request.technicians">
                </v-select>
              </div>
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="approveJob()">
                  <i class="icon ion-ios-checkmark-outline"></i> Confirm
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'approve-modal'" aria-label="Close"
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
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { vButton, vModal, vSelect },
  created() {
    this.request.technicians = this.workRequest.technicians.map(
      (technician) => {
        technician.name = technician.user.name;
        return technician;
      }
    );
    this.tenderArray = this.workRequest.salesOrders.map(
      (salesOrder) => {
        let tenderProcesses = null
        tenderProcesses = salesOrder.tenderProcesses[0].id
        return tenderProcesses;
      }
    )
    this.getTechnicians(this);

  },
  data: () => ({
    tenderArray: [],
    disabled: false,
    request: { technicians: [], text: null },
    technicians: [],
    techniciansLoading: true,
    validationErrors: {}
  }),
  methods: {
    ...mapActions({
      getTechnicians: "people/technicians/getTechnicians"
    }),
    async approveJob() {
      if (!this.validateForm("approve-form")) return false;

      this.disabled = true;
      const { technicians, text } = this.request;
      const technician_ids = technicians.map((technician) => technician.id);
      const work_request_id = this.workRequest.id;
      const tender_process_id = this.tenderArray;

      try {
        const response = await this.$axios.post("work-requests/approve", {
          technician_ids,
          text,
          work_request_id,
          tender_process_id
        });

        this.disabled = false;
        this.text = "";
        this.closeModal("approve-modal");
        this.$emit("update");
        this.toast({ type: "info", title: "Work Request Approved" });
      } catch (error) {
        console.log(error.message);
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
