<template>
  <div class="d-inline">
    <i
      v-modal-open="'delete-file-modal'"
      class="icon ion-trash-a tx-16 tx-danger cursor-pointer float-right"
    ></i>
    <v-modal ref="delete-file-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button
              type="button"
              class="close"
              v-modal-close="'delete-file-modal'"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <span class="tx-100 tx-warning lh-1 mg-t-20 d-inline-block"
              >&#9888;</span
            >
            <h4 class="mg-b-20">Delete {{ file.client_name }}?</h4>
            <p class="mg-b-20 mg-x-20">
              Are you sure you want to delete
              {{ file.client_name }} from the list of params sent?
            </p>
            <v-button
              type="button"
              class="btn btn-danger pd-x-25"
              :disabled="disableDelete"
              @click="deleteFile()"
            >
              <i class="icon ion-ios-checkmark-outline"></i> Delete
            </v-button>
            <button
              type="button"
              class="btn btn-primary pd-x-25"
              v-modal-close="'delete-file-modal'"
              aria-label="Close"
              :disabled="disableDelete"
            >
              <i class="icon ion-ios-close-outline"></i> Cancel
            </button>
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
import modalMixin from "@/mixins/modal";

export default {
  components: { vButton, vModal },
  data: () => ({
    disabled: false,
    disableDelete: false
  }),
  methods: {
    async deleteFile() {
      this.disableDelete = true;
      try {
        const response = await this.$axios.delete("files/" + this.file.id);
        this.disableDelete = false;
        this.closeModal("delete-file-modal");
        this.toast({ type: "info", title: "File Deleted" });
        this.$emit("update");
      } catch (error) {
        this.disableDelete = false;
        this.toast({
          type: "danger",
          title: "Netwok Error. Please contact support"
        });
        console.log(error);
      }
    }
  },
  mixins: [modalMixin],
  props: ["file"]
};
</script>
