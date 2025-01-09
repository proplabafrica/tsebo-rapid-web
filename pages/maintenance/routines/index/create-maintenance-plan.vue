<template>
  <div>
    <form id="create-maintenance-plan-form" class="bg-white pd-20">
      <div class="row">
        <div class="col-md-4 form-group">
          <label class="form-control-label">
            Short Description
            <span class="tx-danger">*</span>
          </label>
          <input
            type="text"
            class="form-control"
            name="name"
            placeholder="Short Description"
            v-model="maintenancePlan.name"
            required
          />
          <small
            class="tx-bold tx-danger"
            v-if="validationErrors.name"
            v-text="validationErrors.name"
          ></small>
        </div>
        <div class="col-md-8 form-group">
          <label class="form-control-label">
            Details
            <span class="tx-danger">*</span>
          </label>
          <textarea
            class="form-control"
            name="description"
            placeholder="Description"
            v-model="maintenancePlan.description"
            required
          ></textarea>
          <small
            class="tx-bold tx-danger"
            v-if="validationErrors.description"
            v-text="validationErrors.description"
          ></small>
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
              v-model="maintenancePlan.frequency"
              required
            /> -->
            <select
              name="frequency_measurement"
              v-model="maintenancePlan.frequency_measurement"
              class="form-control"
              required
            >
              <option :value="null">Select Frequency</option>
              <option
                v-for="measurement in [
                  'bi-weekly',
                  'weekly',
                  'bi-monthly',
                  'monthly',
                  'bi-quarterly',
                  'quarterly',
                  'bi-yearly',
                  'yearly'
                ]"
                :key="measurement"
                :value="measurement"
                v-text="measurement"
              ></option>
            </select>
          </div>
          <small
            class="tx-bold tx-danger"
            v-if="validationErrors.frequency"
            v-text="validationErrors.frequency"
          ></small>
          <small
            class="tx-bold tx-danger float-right"
            v-if="validationErrors.frequency_measurement"
            v-text="validationErrors.frequency_measurement"
          ></small>
        </div>
        <div class="col-md-6 col-lg-4 form-group">
          <label class="form-control-label">
            Time to reminder
            <span class="tx-danger">*</span>
          </label>
          <div class="input-group">
            <input
              type="number"
              name="time_to_reminder"
              placeholder="Time to reminder"
              class="form-control"
              v-model="maintenancePlan.time_to_reminder"
              required
            />
            <select
              name="reminder_measurement"
              v-model="maintenancePlan.reminder_measurement"
              class="form-control"
              required
            >
              <option :value="null">Select Unit</option>
              <option
                v-for="measurement in ['weeks']"
                :key="measurement"
                :value="measurement"
                v-text="measurement"
              ></option>
            </select>
          </div>
          <small
            class="tx-bold tx-danger"
            v-if="validationErrors.frequency"
            v-text="validationErrors.frequency"
          ></small>
          <small
            class="tx-bold tx-danger float-right"
            v-if="validationErrors.reminder_measurement_id"
            v-text="validationErrors.reminder_measurement_id"
          ></small>
        </div>
        <div class="col-md-6 col-lg-4 form-group">
          <label class="form-control-label">
            Select Trade
            <span class="tx-danger">*</span>
          </label>
          <v-select
            class="form-control"
            label="name"
            placeholder="Select Trade"
            selectOnTab
            :options="trades"
            v-model="maintenancePlan.trade"
          ></v-select>
        </div>
        <div class="col-md-6 col-lg-4 form-group">
          <label class="form-control-label">
            Select Unit
            <span class="tx-danger">*</span>
          </label>
          <v-select
            class="form-control"
            label="name"
            placeholder="Select Unit"
            selectOnTab
            :options="units"
            v-model="maintenancePlan.unit"
          ></v-select>
        </div>
        <div class="col-md-6 col-lg-4 form-group">
          <label class="form-control-label">
            Start Date
            <span class="tx-danger">*</span>
          </label>
          <input
            type="date"
            name="started_at"
            class="form-control"
            v-model="jobSchedule.started_at"
            required
          />
          <small
            class="tx-bold tx-danger"
            v-if="validationErrors.started_at"
            v-text="validationErrors.started_at"
          ></small>
        </div>
      </div>
      <div class="form-layout-footer tx-center">
        <v-button
          type="button"
          class="btn btn-primary pd-x-25"
          :disabled="disabled"
          @click="submitMaintenancePlan()"
          >SUBMIT</v-button
        >
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/auth";
const storePath = "maintenance/createRequest";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  disabled: false,
  jobSchedule: {
    maintenance_plan_id: null,
    started_at: null
  },
  maintenancePlan: {
    description: "",
    frequency: null,
    frequency_measurement: null,
    name: "",
    reminder_measurement: null,
    time_to_reminder: 1,
    trade: null,
    unit: null
  },
  measurements: ["days", "weeks"],
  trades: [],
  hierarchies: [],
  validationErrors: {},
  attachEquipment: true,
  baseHierarchies: [],
  baseHierarchiesLoading: true,
  disabled: false,
  formDisabled: false,
  hierarchies: [],
  hierarchiesLoading: true,
  loading: true,
  unitEquipmentList: [],
  unitHierarchy: {
    levels: []
  },
  units: [],
  unitsLoading: true,
  users: [],
  usersLoading: true
});

export default {
  components: { vButton, vSelect },
  created() {
    this.getTrades(this);
    this.getUnits(this);
  },
  data: () => getInitialData(),
  head: () => ({
    title: "Create Unit Scheule · VampFi"
  }),
  meta: {
    pageName: "job-schedules.store"
  },
  methods: {
    ...mapActions({
      getTrades: "people/trades/getTrades",
      getBaseHierarchies: `${storePath}/getBaseHierarchies`,
      getHierarchies: `${storePath}/getHierarchies`,
      getUnits: `${storePath}/getUnits`,
      getUsers: `${storePath}/getUsers`
    }),
    sortHierarchies(level) {
      const levelIndex = findIndex(this.unitHierarchy.levels, ["id", level.id]);
      this.unitHierarchy.levels.splice(levelIndex + 1);
      if (!level.unit) return false;
      this.clientRequest.equipment_ids = [];
      this.clientRequest.unit_id = level.unit.id;

      this.unitEquipmentList = level.unit.equipment.filter(
        (unitEquipment) => unitEquipment.active == 1
      );

      this.unitEquipmentList.push({ name: "No Equipment", id: 0 });

      if (level.unit.children.length < 1) return false;

      var hierarchies = level.unit.hierarchies.filter((unitHierarchy) =>
        this.hierarchies.find((hierarchy) => hierarchy.id == unitHierarchy.id)
      );

      hierarchies = hierarchies.map((hierarchy) => {
        hierarchy.units = this.units.filter(
          (unit) => unit.unit_hierarchy_id == hierarchy.id
        );
        return hierarchy;
      });

      var nextLevel = {
        equipment: [],
        hierarchies,
        hierarchy: null,
        id: `unit-${level.unit.id}`,
        unit: null
      };
      if (this.unitHierarchy.levels.find((level) => level.id == nextLevel.id))
        return false;

      this.unitHierarchy.levels.push(nextLevel);
      this.setDefaultHierarchy(nextLevel);
    },
    setDefaultHierarchy(level) {
      if (level.hierarchies > 1) return true;
      level.hierarchy = level.hierarchies[0];
      return false;
    },
    setEquipmentNames() {
      for (const unit of this.units) {
        unit.equipment = unit.equipment.map((equipment) => {
          if (!equipment.specification) return equipment;
          var name = equipment.name;
          if (equipment.name != equipment.specification.name)
            name = equipment.specification.name;
          equipment.name = `${name} (${equipment.code})`;
          return equipment;
        });
      }
    },
    async submitJobSchedule() {
      const unit_id = this.maintenancePlan.unit.id;

      try {
        await this.$axios.post("job-schedules", {
          ...this.jobSchedule,
          unit_id
        });
        this.disabled = true;
        var { measurements, trades } = this;
        var initialData = Object.assign(getInitialData(), {
          measurements,
          trades
        });
        Object.assign(this.$data, initialData);
        this.toast({ type: "info", title: "Maintenance plan created" });
        this.$emit("update");
        this.$store.commit("maintenance/maintenanceCycles/toggleRefresh");
        this.$router.push(
          `/maintenance/routines`
        );

      } catch (error) {
        this.disabled = false;
        const response = error.response;
        if (response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {
        }
      }
    },
    async submitMaintenancePlan() {
      if (!this.validateForm("create-maintenance-plan-form")) {
        return false;
      }
      this.disabled = true;

      this.maintenancePlan.frequency = 1;

      const trade_ids = [this.maintenancePlan.trade.id];
      const unit_ids = [this.maintenancePlan.unit.id];

      try {
        const maintenancePlan = (
          await this.$axios.post("maintenance-plans", {
            ...this.maintenancePlan,
            trade_ids,
            unit_ids,
            maintenance_plan_scope: "unit"
          })
        ).data.maintenancePlan;
        this.jobSchedule.maintenance_plan_id = maintenancePlan.id;
        this.submitJobSchedule();
      } catch (error) {
        this.disabled = false;
        const response = error.response;
        if (response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {
        }
      }
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, formMixin],
  props: ["unit"]
};
</script>
