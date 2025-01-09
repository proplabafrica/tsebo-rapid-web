<template>
  <div>
    <i class="icon ion-android-create tx-16 tx-info cursor-pointer float-right" v-modal-open="'edit-sla-modal'"></i>
    <v-modal ref="edit-sla-modal">
      <div class="modal-dialog" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'edit-sla-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h6 class="slim-card-title mg-b-20">Edit SLA</h6>
            <form id="edit-sla-form">
              <div class="form-group">
                <label for="name" class="form-control-label">
                  Name
                  <span class="tx-danger">*</span>
                </label>
                <input type="text" name="name" v-model="editedSla.name" class="form-control" placeholder="Name" />
                <small class="tx-bold tx-danger" v-text="validationErrors.name"></small>
              </div>
              <div class="form-group">
                <label for="expected_time" class="form-control-label">
                  Expected Time
                  <span class="tx-danger">*</span>
                </label>
                <div class="input-group">
                  <input type="number" name="expected_time" placeholder="Expected Time" class="form-control"
                    v-model="editedSla.expected_time" required />
                  <select name="expected_time_measurement" v-model="editedSla.expected_time_measurement"
                    class="form-control" required>
                    <option :value="null">Select Unit</option>
                    <option v-for="measurement in ['hours', 'days', 'weeks']" :key="measurement" :value="measurement"
                      v-text="measurement"></option>
                  </select>
                </div>
                <small class="tx-bold tx-danger" v-if="validationErrors.expected_time"
                  v-text="validationErrors.expected_time"></small>
                <small class="tx-bold tx-danger float-right" v-if="validationErrors.expected_time_measurement"
                  v-text="validationErrors.expected_time_measurement"></small>
              </div>
              <div class="form-group">
                <label for="system_entity_code" class="form-control-label">
                  Entity
                  <span class="text-danger">*</span>
                </label>
                <select name="system_entity_code" v-model="editedSla.system_entity_code" class="form-control" required>
                  <option :value="null">Select One</option>
                  <option v-for="entity in systemEntities" :key="entity.id" :value="entity.code" v-text="entity.name">
                  </option>
                </select>
                <small class="tx-bold tx-danger" v-text="validationErrors.system_entity_code"></small>
              </div>
              <div class="form-group">
                <label for="sla_priority_code" class="form-control-label">
                  Priority
                  <span class="text-danger">*</span>
                </label>
                <select name="sla_priority_code" v-model="editedSla.sla_priority_code" class="form-control" required>
                  <option :value="null">Select One</option>
                  <option v-for="priority in slaPriorities" :key="priority.id" :value="priority.code"
                    v-text="priority.name"></option>
                </select>
                <small class="tx-bold tx-danger" v-text="validationErrors.sla_priority_code"></small>
              </div>
              <div class="form-group">
                <label for="trade_code" class="form-control-label">
                  Trade
                  <span class="text-danger">*</span>
                </label>
                <select name="trade_code" v-model="editedSla.trade_code" class="form-control" required>
                  <option :value="null">Select One</option>
                  <option v-for="trade in trades" :key="trade.id" :value="trade.code" v-text="trade.name"></option>
                </select>
                <small class="tx-bold tx-danger" v-text="validationErrors.trade_code"></small>
              </div>
              <div class="form-group">
                <label class="ckbox">
                  <input type="checkbox" :value="editedSla.active" v-model="editedSla.active" />
                  <span>{{ editedSla.active ? "Active" : "Inactive" }}</span>
                </label>
              </div>
              <div class="form-layout-footer tx-center">
                <v-button class="btn btn-primary bd-0" @click="updateSla()" :disabled="disabled">UPDATE</v-button>
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
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { vButton, vModal },
  async created() {
    this.setEditedSla();
  },
  data: () => ({
    disabled: false,
    editedSla: {
      active: true,
      name: null,
      expected_time: null,
      expected_time_measurement: null,
      system_entity_code: null,
      sla_priority_code: null,
      trade_code: null
    },
    validationErrors: {}
  }),
  methods: {
    setEditedSla() {
      const {
        active,
        name,
        expected_time,
        measurement,
        entity,
        priority,
        trade
      } = this.sla;

      this.editedSla = Object.assign(
        {},
        {
          active,
          name,
          expected_time,
          expected_time_measurement: measurement ? measurement.code : null,
          system_entity_code: entity ? entity.code : null,
          sla_priority_code: priority ? priority.code : null,
          trade_code: trade ? trade.code : null
        }
      );
    },
    async updateSla() {
      if (!this.validateForm("edit-sla-form")) return false;
      this.disabled = true;

      try {
        if (this.editedSla.active) this.editedSla.active = true;
        const response = await this.$axios.put(
          `slas/${this.sla.id}`,
          this.editedSla
        );
        this.disabled = false;
        this.$store.commit("performance/slas/toggleRefresh");
        this.$emit("updated", this);
        this.closeModal("edit-sla-modal");
        this.toast({ title: "SLA updated", type: "success" });
      } catch (error) {
        this.disabled = false;
        console.log(error);
        this.toast({ title: "Could not update SLA", type: "danger" });
        const response = error.response;
        if (!response) return false;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else {
          // response);
        }
      }
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["sla", "slaPriorities", "systemEntities", "trades"]
};
</script>
