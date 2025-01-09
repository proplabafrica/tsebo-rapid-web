<template>
  <div>
    <span
      v-if="authorized('job-schedules.update')"
      v-modal-open="'edit-plan-modal'"
      class="btn btn-sm btn-info bd-0 mg-t-5"
    >
      <i class="icon ion-ios-gear-outline"></i> Edit Maintenance Plan
    </span>
    <v-modal ref="edit-plan-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button
              type="button"
              class="close"
              v-modal-close="'edit-plan-modal'"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Edit Maintenance Plan?</h4>
            <div id="edit-plan">
              <button type="button" class="btn pd-x-25">
                <nuxt-link
                  :to="`/maintenance/routines/job-schedules/details/settings?id=${jobSchedule.id}`"
                >
                  <i class="icon ion-ios-checkmark-outline"></i> Confirm Edit
                </nuxt-link>
              </button>

              <button
                type="button"
                class="btn btn-danger pd-x-25"
                v-modal-close="'send-next-cycle-modal'"
                aria-label="Close"
                :disabled="disabled"
              >
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
import authMixin from "@/mixins/auth";


export default {
  components: { vButton, vModal },
  data: () => ({
    text: "",
    disabled: false,
    validationErrors: {}
  }),
  mixins: [formMixin, modalMixin, authMixin],
  props: ["jobSchedule"]
};
</script>
