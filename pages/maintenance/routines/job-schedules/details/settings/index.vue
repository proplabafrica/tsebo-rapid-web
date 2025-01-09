<template>
  <form id="update-job-schedule-form" class="bg-white pd-20">
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
      <div class="col-md-4 form-group">
        <label class="form-control-label">
          Details
          <span class="tx-danger">*</span>
        </label>
        <textarea type="text" class="form-control" name="description" placeholder="Description"
          v-model="editedMaintenancePlan.description" required></textarea>
        <!-- Validation Error message -->
        <small class="tx-bold tx-danger" v-if="validationErrors.description" v-text="validationErrors.description">
        </small>
      </div>
      <div class="col-md-6 col-lg-4 form-group">
        <label class="form-control-label">
          Frequency
          <span class="tx-danger">*</span>
        </label>
        <div class="input-group">
          <!-- <input
              type="number"
              name="frequency"
              placeholder="Frequency"
              class="form-control"
              v-model="editedMaintenancePlan.frequency"
              required
            /> -->
          <select name="frequency_measurement" v-model="editedMaintenancePlan.frequency_measurement"
            class="form-control" required>
            <!-- <option :value="null">Select Unit</option> -->
            <option :value="null">Select Frequency</option>
            <option v-for="measurement in [
              'bi-weekly',
              'weekly',
              'bi-monthly',
              'monthly',
              'bi-quarterly',
              'quarterly',
              'bi-yearly',
              'yearly'
            ]" :key="measurement" :value="measurement" v-text="measurement"></option>
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
          <input type="number" name="time_to_reminder" placeholder="Time to reminder" class="form-control" required />
          <select name="reminder_measurement" class="form-control" v-model="editedMaintenancePlan.reminder_measurement"
            required>
            <!-- Remove placeholders -->
            <option :value="null">Select Unit</option>
            <option v-for="measurement in ['weeks']" :key="`reminder-measurement-${measurement}`" :value="measurement"
              v-text="measurement"></option>
          </select>
        </div>
        <!-- Validation Error message -->
        <small class="tx-bold tx-danger" v-if="validationErrors.time_to_reminder"
          v-text="validationErrors.time_to_reminder"></small>
        <small class="tx-bold tx-danger float-right" v-if="validationErrors.reminder_measurement"
          v-text="validationErrors.reminder_measurement"></small>
      </div>
      <div class="col-md-6 col-lg-4 form-group">
        <label class="form-control-label">
          Select Trades
          <span class="tx-danger">*</span>
        </label>
        <v-select arial-multiselectable class="form-control" label="name" multiple placeholder="Select Trades"
          selectOnTab @search="searchTrades" :options="trades" v-model="editedMaintenancePlan.trades"
          :required="!editedMaintenancePlan.trades">
          <template slot="no-options">type to search trades...</template>
        </v-select>
      </div>
      <div class="col-md-6 col-lg-4 form-group">
        <label class="form-control-label">
          Select Equipment Specifications
          <span class="tx-danger">*</span>
        </label>
        <v-select arial-multiselectable class="form-control" label="name" multiple placeholder="Select Equipment Specs"
          selectOnTab @search="searchEquipmentSpecs" :options="equipmentSpecs"
          v-model="editedMaintenancePlan.equipmentSpecs">
          <template slot="no-options">type to search equipment specs...</template>
        </v-select>
      </div>
      <div class="col-md-6 col-lg-4 form-group">
        <label class="form-control-label">
          Start Date
          <span class="tx-danger">*</span>
        </label>
        <input type="date" name="started_at" class="form-control" v-model="editedJobSchedule.started_at" required />
        <small class="tx-bold tx-danger" v-if="validationErrors.started_at"
          v-text="validationErrors.started_at"></small>
      </div>
    </div>
    <div class="form-layout-footer tx-center">
      <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="updateJobSchedule()">UPDATE
      </v-button>
      <!-- Add delete button -->
      <!-- Create a job-schedule delete component -->
      <!-- <delete /> -->
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  disabled: false,
  equipmentSpecs: [],
  measurements: [],
  trades: [],
  validationErrors: {},
  editedJobSchedule: {
    started_at: null,
    equipment_ids: []
  },
  editedMaintenancePlan: {
    description: null,
    frequency: null,
    frequency_measurement: null,
    name: null,
    reminder_measurement: null,
    time_to_reminder: 1,
    trades: [],
    equipmentSpecs: []
  }
});

export default {
  components: {
    vButton,
    vSelect
  },
  head: () => ({
    title: "Create Job Schedule . Tsebo-Rapid"
  }),
  meta: {
    pageName: "job-schedule.update"
  },
  data: () => getInitialData(),
  created() {
    this.setEditedJobSchedule();
    this.setEditedMaintenancePlan();
  },
  methods: {
    ...mapActions({
      getEquipmentSpecs: "assets/equipmentSpecs/getEquipmentSpecs",
      getMeasurements: "utility/measurements/getMeasurements",
      getTrades: "people/trades/getTrades"
    }),
    setEditedJobSchedule() {
      const { started_at, equipmentList } = this.jobSchedule;
      var equipment_ids = equipmentList.map((equipment) => equipment.id);

      this.editedJobSchedule = Object.assign(
        {},
        {
          started_at,
          equipment_ids
        }
      );
    },

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
      } = this.jobSchedule.plan;

      var frequency_measurement = ["days", "weeks"].find(
        (unit) => unit === frequencyMeasurement.code
      );
      var reminder_measurement = ["weeks"].find(
        (unit) => unit == reminderMeasurement.code
      );
      var trade_ids = trades.map((trade) => trade.id);
      var equipment_specification_ids = equipmentSpecs.map((spec) => spec.id);

      this.editedMaintenancePlan = Object.assign(
        {},
        {
          description,
          frequency,
          frequency_measurement,
          reminder_measurement,
          name,
          time_to_reminder,
          trade_ids,
          equipment_specification_ids
        }
      );
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
    async searchEquipmentSpecs(search, loading) {
      this.debounce(async () => {
        this.equipmentSpecs = [];
        if (!search) return;
        loading(false);
        await this.getEquipmentSpecs(this);
        loading(false);
      }, 800);
    },
    async updateJobSchedule() {
      if (!this.validateForm("update-job-schedule-form")) return false;
      this.disabled = true;

      const { started_at, equipment_ids } = this.editedJobSchedule;

      try {
        const response = await this.$axios.put(
          `job-schedules/${this.jobSchedule.id}`,
          {
            started_at,
            equipment_ids
          }
        );

        this.updateMaintenancePlan();

        this.disabled = false;
        this.toast({ type: "info", title: "Job Schedule Updated" });
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "dangere",
          title: "Unable to update Job Schedule"
        });
      }
    },
    async updateMaintenancePlan() {
      const {
        description,
        frequency,
        frequency_measurement,
        reminder_measurement,
        name,
        time_to_reminder,
        trade_ids,
        equipment_specification_ids
      } = this.editedMaintenancePlan;

      try {
        const response = await this.$axios.put(
          `maintenance-plans/${this.jobSchedule.plan.id}`,
          {
            description,
            frequency: 1,
            frequency_measurement,
            reminder_measurement,
            name,
            time_to_reminder,
            trade_ids,
            equipment_specification_ids
          }
        );
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "dangere",
          title: "Unable to update Job Schedule"
        });
      }
    }
  },
  props: ["jobSchedule"],
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin]
};
</script>