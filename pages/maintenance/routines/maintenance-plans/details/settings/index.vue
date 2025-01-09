<template>
  <form id="update-maintenance-plan-form" class="bg-white pd-20">
    <div class="row">
      <div class="col-md-4 form-group">
        <label class="form-control-label">
          Short Description
          <span class="tx-danger">*</span>
        </label>
        <input type="text" class="form-control" name="name" placeholder="Short Description"
          v-model="editedMaintenancePlan.name" required />
        <small class="tx-bold tx-danger" v-if="validationErrors.name" v-text="validationErrors.name"></small>
      </div>
      <div class="col-md-8 form-group">
        <label class="form-control-label">
          Details
          <span class="tx-danger">*</span>
        </label>
        <textarea class="form-control" name="description" placeholder="Description"
          v-model="editedMaintenancePlan.description" required></textarea>
        <small class="tx-bold tx-danger" v-if="validationErrors.description"
          v-text="validationErrors.description"></small>
      </div>
      <div class="col-md-6 col-lg-4 form-group">
        <label class="form-control-label">
          Frequency
          <span class="tx-danger">*</span>
        </label>
        <div class="input-group">
          <input type="number" name="frequency" placeholder="Frequency" class="form-control"
            v-model="editedMaintenancePlan.frequency" required />
          <select name="frequency_measurement" v-model="editedMaintenancePlan.frequency_measurement"
            class="form-control" required>
            <option :value="null">Select Unit</option>
            <option v-for="measurement in ['days', 'weeks']" :key="`frequency-measurement-${measurement}`"
              :value="measurement" v-text="measurement"></option>
          </select>
        </div>
        <small class="tx-bold tx-danger" v-if="validationErrors.frequency" v-text="validationErrors.frequency"></small>
        <small class="tx-bold tx-danger float-right" v-if="validationErrors.frequency_measurement"
          v-text="validationErrors.frequency_measurement"></small>
      </div>
      <div class="col-md-6 col-lg-4 form-group">
        <label class="form-control-label">
          Time to reminder
          <span class="tx-danger">*</span>
        </label>
        <div class="input-group">
          <input type="number" name="time_to_reminder" placeholder="Time to reminder" class="form-control"
            v-model="editedMaintenancePlan.time_to_reminder" required />
          <select name="reminder_measurement" v-model="editedMaintenancePlan.reminder_measurement" class="form-control"
            required>
            <option :value="null">Select Unit</option>
            <option v-for="measurement in ['weeks']" :key="`reminder-measurement-${measurement}`" :value="measurement"
              v-text="measurement"></option>
          </select>
        </div>
        <small class="tx-bold tx-danger" v-if="validationErrors.frequency" v-text="validationErrors.frequency"></small>
        <small class="tx-bold tx-danger float-right" v-if="validationErrors.reminder_measurement"
          v-text="validationErrors.reminder_measurement"></small>
      </div>
      <div class="col-md-6 col-lg-4 form-group">
        <label class="form-control-label">
          Select Trades
          <span class="tx-danger">*</span>
        </label>
        <v-select aria-multiselectable class="form-control" label="name" multiple placeholder="Select Trades"
          selectOnTab @search="searchTrades" :options="trades" v-model="editedMaintenancePlan.trades">
          <template slot="no-options">type to search trades...</template>
        </v-select>
      </div>
      <div class="col-md-6 col-lg-4 form-group">
        <label class="form-control-label">
          Select Equipment Specifications
          <span class="tx-danger">*</span>
        </label>
        <v-select aria-multiselectable class="form-control" label="name" multiple placeholder="Select Equipment Specs"
          selectOnTab @search="searchEquipmentSpecs" :options="equipmentSpecs"
          v-model="editedMaintenancePlan.equipmentSpecs">
          <template slot="no-options">type to search equipment specs...</template>
        </v-select>
      </div>
    </div>
    <div class="form-layout-footer tx-center">
      <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="updateMaintenancePlan()">
        UPDATE</v-button>
      <delete :maintenancePlan="maintenancePlan" />
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  disabled: false,
  equipmentSpecs: [],
  editedMaintenancePlan: {
    description: null,
    frequency: null,
    frequency_measurement: null,
    name: null,
    reminder_measurement: null,
    time_to_reminder: 1,
    trades: [],
    equipmentSpecs: []
  },
  measurements: [],
  trades: [],
  validationErrors: {}
});

export default {
  components: {
    vButton,
    vSelect,
    delete: () =>
      import("@/components/maintenance/routines/maintenance-plans/delete")
  },
  created() {
    this.getMeasurements(this);
    this.setEditedMaintenancePlan();
  },
  data: () => getInitialData(),
  head: () => ({
    title: "Create Maintenance Plan · Tsebo-Rapid"
  }),
  meta: {
    pageName: "maintenance-plans.store"
  },
  methods: {
    ...mapActions({
      getEquipmentSpecs: "assets/equipmentSpecs/getEquipmentSpecs",
      getMeasurements: "utility/measurements/getMeasurements",
      getTrades: "people/trades/getTrades"
    }),
    setEditedMaintenancePlan() {
      const {
        frequencyMeasurement,
        reminder_measurement_id,
        description,
        frequency,
        equipmentSpecs,
        name,
        time_to_reminder,
        reminderMeasurement,
        trades
      } = this.maintenancePlan;

      var frequency_measurement = ["days", "weeks"].find(
        (unit) => unit === frequencyMeasurement.code
      );

      var reminder_measurement = ["weeks"].find(
        (unit) => unit === reminderMeasurement.code
      );

      this.editedMaintenancePlan = Object.assign(
        {},
        {
          description,
          frequency,
          frequency_measurement,
          name,
          reminder_measurement,
          time_to_reminder,
          trades,
          equipmentSpecs
        }
      );
    },
    async searchEquipmentSpecs(search, loading) {
      this.debounce(async () => {
        this.equipmentSpecs = [];
        if (!search) return;
        loading(true);
        this.equipmentSpecSearch = search;
        await this.getEquipmentSpecs(this);
        loading(false);
      }, 800);
    },
    async searchTrades(search, loading) {
      this.debounce(async () => {
        this.trades = [];
        if (!search) return;
        loading(true);
        this.tradeSearch = search;
        await this.getTrades(this);
        loading(false);
      }, 800);
    },
    async updateMaintenancePlan() {
      if (!this.validateForm("update-maintenance-plan-form")) return false;
      this.disabled = true;

      const {
        description,
        frequency,
        frequency_measurement,
        name,
        reminder_measurement,
        time_to_reminder,
        trades,
        equipmentSpecs
      } = this.editedMaintenancePlan;

      const trade_ids = trades.map((trade) => trade.id);
      const equipment_specification_ids = equipmentSpecs.map(
        (equipmentSpec) => equipmentSpec.id
      );

      try {
        const response = await this.$axios.put(
          `maintenance-plans/${this.maintenancePlan.id}`,
          {
            description,
            frequency,
            frequency_measurement,
            name,
            reminder_measurement,
            time_to_reminder,
            trade_ids,
            equipment_specification_ids
          }
        );
        this.disabled = false;
        this.toast({ type: "info", title: "Maintenance Plan Updated" });
        this.$emit("update");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable to Update Maintenance Plan"
        });
      }
    },
    async deleteMaintenancePlan() {
      this.disabled = true;

      const { trades, equipmentSpecs, units } = this.editedMaintenancePlan;

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
        this.toast({ type: "info", title: "Maintenance Plan Deleted" });
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable to Delete Maintenance Plan"
        });
      }
    },
    timeMeasurements(selection = []) {
      return this.measurements.filter(
        (measurement) =>
          measurement.type.code == "time" &&
          selection.includes(measurement.code)
      );
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin],
  props: ["maintenancePlan"]
};
</script>
