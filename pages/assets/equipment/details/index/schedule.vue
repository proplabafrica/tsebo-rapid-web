<template>
  <div class="row mg-t-10 mg-x-0" v-if="!jobSchedulesLoading">
    <form id="create-job-schedule-form" class="bg-white pd-10 col-lg-4">
      <fieldset :disabled="formDisabled">
        <div class="form-group">
          <label class="form-control-label">
            Select Trade
            <span class="tx-danger">*</span>
          </label>
          <select name="trade_code" class="form-control" required v-model="jobSchedule.trade_code"
            @change="getTradeMaintenancePlans()">
            <option :value="null">Select One</option>
            <option v-for="trade in trades" :key="trade.id" :value="trade.code" v-text="trade.name"></option>
          </select>
          <small class="tx-bold tx-danger" v-if="validationErrors.trade_code"
            v-text="validationErrors.trade_code"></small>
        </div>
        <div class="form-group">
          <label class="form-control-label">
            Select Maintenance Plan
            <span class="tx-danger">*</span>
          </label>
          <select name="maintenance_plan_id" class="form-control" required v-model="jobSchedule.maintenance_plan_id">
            <option :value="null">Select One</option>
            <option v-for="plan in maintenancePlans" :key="plan.id" :value="plan.id" v-text="plan.name"></option>
          </select>
          <small class="tx-bold tx-danger" v-if="validationErrors.maintenance_plan_id"
            v-text="validationErrors.maintenance_plan_id"></small>
        </div>
        <div class="form-group">
          <label class="form-control-label">
            Start Date
            <span class="tx-danger">*</span>
          </label>
          <input type="date" name="started_at" class="form-control" v-model="jobSchedule.started_at" required />
          <small class="tx-bold tx-danger" v-if="validationErrors.started_at"
            v-text="validationErrors.started_at"></small>
        </div>
        <div class="form-layout-footer tx-center">
          <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitJobSchedule()">SUBMIT</v-button>
        </div>
      </fieldset>
    </form>
    <div class="col-lg-8 pd-0 pd-lg-l-10 mg-t-10 mg-lg-t-0">
      <div class="table-responsive bg-white">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Scope</th>
            </tr>
          </thead>
          <tbody v-if="jobSchedules.length > 0">
            <tr v-for="schedule in jobSchedules" :key="schedule.id">
              <td>
                <nuxt-link class="tx-inverse tx-bold d-block"
                  :to="`/maintenance/routines/job-schedules/details?id=${schedule.id}`" v-text="schedule.plan.name">
                </nuxt-link>
                <span class="tx-12 d-block" v-text="schedule.plan.description"></span>
                <span class="tx-12 d-block" v-if="nextMaintenanceCycle(schedule)">
                  <span class="tx-bold">Due:</span>
                  {{
                  (nextMaintenanceCycle(schedule).due_at * 1000) | dateFormat
                  }}
                </span>
              </td>
              <td>
                <span v-for="equipment in schedule.equipmentList" :key="equipment.id">
                  <nuxt-link :to="`/assets/equipment/details?id=${equipment.id}`"
                    class="tx-inverse tx-14 tx-medium d-block" v-text="equipment.code"></nuxt-link>
                  <span class="tx-12 d-block" v-text="equipment.name"></span>
                </span>
                <span class="tx-inverse tx-12" v-if="schedule.plan.scope" v-text="schedule.plan.scope.name"></span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="2">
                <h5>No data to display</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  disabled: false,
  formDisabled: false,
  jobSchedule: {
    equipmentList: [],
    maintenance_plan_id: null,
    started_at: "",
    trade_code: null
  },
  jobSchedules: [],
  jobSchedulesLoading: true,
  maintenancePlans: [],
  trades: [],
  validationErrors: {}
});

export default {
  components: { loading, vButton },
  computed: {
    jobSchedulesEquipmentIds() {
      return [this.equipment.id];
    }
  },
  created() {
    this.getJobSchedules(this);
    this.getTrades(this);
  },
  data: () => getInitialData(),
  head: () => ({
    title: "Maintenance Schedule · Tsebo-Rapid"
  }),
  methods: {
    ...mapActions({
      getJobSchedules: "maintenance/jobSchedules/getJobSchedules",
      getMaintenancePlans: "maintenance/maintenancePlans/getMaintenancePlans",
      getTrades: "people/trades/getTrades"
    }),
    async getTradeMaintenancePlans() {
      this.formDisabled = true;
      this.maintenancePlanTradeCodes = [this.jobSchedule.trade_code];
      await this.getMaintenancePlans(this);
      this.$store.commit("maintenance/maintenancePlans/toggleRefresh");
      this.formDisabled = false;
    },
    nextMaintenanceCycle(schedule) {
      if (schedule.cycles.length < 1) return {};
      return schedule.cycles.find(
        (cycle) => schedule.current_cycle_count == cycle.cycle_count
      );
    },
    async submitJobSchedule() {
      if (!this.validateForm("create-job-schedule-form")) return false;
      this.disabled = true;

      const { maintenance_plan_id, started_at } = this.jobSchedule;
      const equipment_ids = [this.equipment.id];
      const unit_id = this.equipment.unit.id;

      try {
        const response = await this.$axios.post("job-schedules", {
          equipment_ids,
          maintenance_plan_id,
          started_at,
          unit_id
        });
        this.disabled = true;
        var { trades } = this;

        var initialData = Object.assign(getInitialData(), { trades });
        Object.assign(this.$data, initialData);

        this.jobSchedulesLoading = true;
        this.$store.commit("maintenance/jobSchedules/toggleRefresh");
        this.getJobSchedules(this);
      } catch (error) {
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {}
      }
    }
  },
  mixins: [authMixin, formMixin],
  props: ["equipment"]
};
</script>
