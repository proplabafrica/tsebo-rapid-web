<template>
  <div>
    <div class="modal-dialog wd-300 wd-sm-400" role="document">
      <div class="modal-content tx-size-sm">
        <div class="modal-body tx-center pd-y-20 pd-x-20">
          <button
            type="button"
            class="close"
            v-modal-close="'delete-modal'"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 style="font-size: 16px" class="mg-b-20">
            Are you sure you want to delete this plan?
          </h4>
          <div class="form-layout-footer">
            <v-button
              type="button"
              style="border-radius: 8px"
              class="btn btn-primary pd-x-4"
              :disabled="disabled"
              @click="action"
            >
              <i class="icon ion-ios-checkmark-outline"></i>
              Confirm
            </v-button>
            <button
              style="border-radius: 8px"
              type="button"
              class="btn btn-danger pd-x-4"
              :v-modal-close="modld"
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
  </div>
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
export default {
  components: { vModal, vButton },
  data() {
    return {
    };
  },
  mixins: [modalMixin],
  props: {
    disabled: Boolean,
    action: Function,
    modld: String
  }
};
</script>


<style scoped>
</style>