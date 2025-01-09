<template>
  <div class="d-inline">
    <span
      v-modal-open="'delete-web-hook-param-modal'"
      class="btn btn-outline-danger btn-icon rounded-circle cursor-pointer mg-10"
    >
      <div>
        <i class="icon ion-trash-a"></i>
      </div>
    </span>
    <v-modal ref="delete-web-hook-param-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button
              type="button"
              class="close"
              v-modal-close="'delete-web-hook-param-modal'"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <span class="tx-100 tx-warning lh-1 mg-t-20 d-inline-block"
              >&#9888;</span
            >
            <h4 class="mg-b-20">Delete {{ webHook.params[index].name }}?</h4>
            <p class="mg-b-20 mg-x-20">
              Are you sure you want to delete
              {{ webHook.params[index].name }} from the list of params sent?
            </p>
            <v-button
              type="button"
              class="btn btn-danger pd-x-25"
              :disabled="disableDelete"
              @click="deleteParam()"
            >
              <i class="icon ion-ios-checkmark-outline"></i> Delete
            </v-button>
            <button
              type="button"
              class="btn btn-primary pd-x-25"
              v-modal-close="'delete-web-hook-param-modal'"
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
    async deleteParam() {
      const paramToDelete = this.webHook.params[this.index];
      if (!paramToDelete.id) {
        this.closeModal("delete-web-hook-param-modal");
        this.$emit("deleteParam", this.index);
        return true;
      }

      this.disableDelete = true;

      try {
        const response = await this.$axios.delete(
          "web-hook-params/" + paramToDelete.id
        );
        this.disableDelete = false;
        this.closeModal("delete-web-hook-param-modal");
        this.$emit("deleteParam", this.index);
      } catch (error) {
        this.disableDelete = false;
        console.log(error);
      }
    }
  },
  mixins: [modalMixin],
  props: ["webHook", "index"]
};
</script>
