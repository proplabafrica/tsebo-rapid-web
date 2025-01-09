<template>
  <div class="mg-b-5" style="display: inline">
    <span v-modal-open="'delete-modal'">
      <slot>
        <span class="btn btn-danger pd-x-25"> DELETE </span>
      </slot>
    </span>
    <v-modal ref="delete-modal">
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
            <h4 class="mg-b-20">Delete Plan?</h4>
            <div class="form-layout-footer">
              <v-button
                type="button"
                class="btn btn-primary pd-x-25"
                :disabled="disabled"
                @click="deleteMaintenancePlan()"
              >
                <i class="icon ion-ios-checkmark-outline"></i> Confirm
              </v-button>
              <button
                type="button"
                class="btn btn-danger pd-x-25"
                v-modal-close="'delete-modal'"
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

export default {
  components: { vButton, vModal },
  data: () => ({
    text: null,
    disabled: false,
    validationErrors: {},
    shouldRefresh: false
  }),
  methods: {
    async deleteMaintenancePlan() {
      this.disabled = true;

      const { trades, equipmentSpecs, units } = this.maintenancePlan;

      const trade_ids = trades.map((trade) => trade.id);
      const equipment_specification_ids = equipmentSpecs.map(
        (equipmentSpec) => equipmentSpec.id
      );
      const unit_ids = units.map((unit) => unit.id);

      try {
        const response = await this.$axios.delete(
          `maintenance-plans/${this.maintenancePlan.id}`,
          {
            trade_ids,
            equipment_specification_ids,
            unit_ids
          }
        );
        this.disabled = false;
        this.$router.replace("/maintenance/routines/maintenance-plans");
        this.$store.commit("maintenance/maintenancePlans/toggleRefresh");
        this.toast({ type: "info", title: "Maintenance Plan Deleted" });
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable to Delete Maintenance Plan"
        });
      }
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["maintenancePlan"]
};
</script>
