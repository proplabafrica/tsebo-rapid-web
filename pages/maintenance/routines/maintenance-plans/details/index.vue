<template>
  <div class="pd-0 pd-lg-l-10 mg-t-10 mg-lg-t-0">
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
              <nuxt-link
                class="tx-inverse tx-bold d-block"
                :to="`/maintenance/routines/job-schedules/details?id=${schedule.id}`"
                v-text="schedule.plan.name"
              ></nuxt-link>
              <span
                class="tx-12 d-block"
                v-text="schedule.plan.description"
              ></span>
              <span class="tx-12 d-block" v-if="nextMaintenanceCycle(schedule)">
                <span class="tx-bold">Due:</span>
                {{
                  (nextMaintenanceCycle(schedule).due_at * 1000) | dateFormat
                }}
              </span>
            </td>
            <td>
              <span
                v-for="equipment in schedule.equipmentList"
                :key="equipment.id"
              >
                <nuxt-link
                  :to="`/assets/equipment/details?id=${equipment.id}`"
                  class="tx-inverse tx-14 tx-medium d-block"
                  v-text="equipment.code"
                ></nuxt-link>
                <span class="tx-12 d-block" v-text="equipment.name"></span>
              </span>
              <span
                class="tx-inverse tx-12"
                v-if="schedule.plan.scope"
                v-text="schedule.plan.scope.name"
              ></span>
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
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton },
  computed: {
    jobSchedulesmaintenancePlanId() {
      return this.maintenancePlan.id;
    }
  },
  created() {
    this.getJobSchedules(this);
  },
  data: () => ({
    jobSchedules: [],
    jobSchedulesLoading: true
  }),
  head() {
    return {
      title: `Job Schedules · ${this.maintenancePlan.name} · this.authUser.organizations[0].name`
    };
  },
  methods: {
    ...mapActions({
      getJobSchedules: "maintenance/jobSchedules/getJobSchedules"
    }),
    nextMaintenanceCycle(schedule) {
      if (schedule.cycles.length < 1) return {};
      return schedule.cycles.find(
        (cycle) => schedule.current_cycle_count == cycle.cycle_count
      );
    }
  },
  mixins: [authMixin, formMixin],
  props: ["maintenancePlan"]
};
</script>
