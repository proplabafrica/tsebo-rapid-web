<template>
  <div class="d-inline mg-b-5">
    <span v-modal-open="'rate-job-modal'">
      <slot>
        <span class="btn btn-primary bd-0">Create Request</span>
      </slot>
    </span>
    <v-modal ref="rate-job-modal">
      <div class="modal-dialog wd-300 wd-sm-500" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body pd-y-20 pd-x-20">
            <button
              type="button"
              class="close"
              v-modal-close="'rate-job-modal'"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <create-request-form />
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
const storePath = "maintenance/createRequest";
import { mapActions } from "vuex";
import createRequestForm from "@/components/maintenance/requests/create";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";

export default {
  components: { createRequestForm, vModal },
  created() {
    this.getBaseHierarchies(this);
    this.getHierarchies(this);
    this.getUnits(this);
    this.getUsers(this);
  },
  methods: {
    ...mapActions({
      getBaseHierarchies: `${storePath}/getBaseHierarchies`,
      getHierarchies: `${storePath}/getHierarchies`,
      getUnits: `${storePath}/getUnits`,
      getUsers: `${storePath}/getUsers`
    })
  },
  mixins: [modalMixin]
};
</script>
