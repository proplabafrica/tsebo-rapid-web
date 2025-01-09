<template>
  <div class="pd-0 pd-lg-l-10 mg-t-10 mg-lg-t-0">
    <div class="table-responsive bg-white">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Scope</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="unit.jobSchedules.length > 0">
          <tr v-for="schedule in unit.jobSchedules" :key="schedule.id">
            <td>
              <nuxt-link class="tx-inverse tx-bold d-block" :to="
                schedule.workRequests[0]
                  ? `/maintenance/routines/job-schedules/details?id=${schedule.id}`
                  : `/maintenance/routines/job-schedules/approval?id=${schedule.id}`
              " v-text="schedule.plan.name"></nuxt-link>
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
            <td>
              <span v-modal-open="'delete-modal'" @click="scheduleToDelete = schedule" v-if="isFM">
              </span>
              <span v-modal-open="'delete-modal'" @click="scheduleToDelete = schedule" v-if="!isFM">
                <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
              </span>

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
      <v-modal ref="delete-modal">
        <div class="modal-dialog wd-300 wd-sm-400" role="document">
          <div class="modal-content tx-size-sm">
            <div class="modal-body tx-center pd-y-20 pd-x-20">
              <button type="button" class="close" v-modal-close="'delete-modal'" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 style="font-size: 16px" class="mg-b-20">
                Are you sure you want to delete this schedule?
              </h4>
              <div class="form-layout-footer">
                <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4" :disabled="disabled"
                  @click="deleteJobSchedule()">
                  <i class="icon ion-ios-checkmark-outline"></i>
                  Confirm
                </v-button>
                <button style="border-radius: 8px" type="button" class="btn btn-danger pd-x-4"
                  v-modal-close="'delete-modal'" aria-label="Close" :disabled="disabled">
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
  </div>
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import { mapActions } from "vuex";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import moment from "moment"

export default {
  components: { vModal, vButton },
  data() {
    return {
      scheduleToDelete: [],
      planToDelete: [],
      disabled: null,
      isFM: false,
    };
  },
  head: () => ({
    title: "Maintenance Schedule · Tsebo-Rapid"
  }),
  mounted() {
    this.getIsFM()
  },
  methods: {
    getIsFM() {
      if (this.authUser.roles) {
        for (const i in this.authUser.roles) {
          if (this.authUser.roles[i].code === 'FM') {
            this.isFM = true;
            break;
          }
        }
      }
    },
    async deleteJobSchedule() {
      let jobSchedule = this.scheduleToDelete;
      this.planToDelete = jobSchedule.plan;
      this.disabled = true;

      const equipment_ids = jobSchedule.equipmentList.map(
        (equipment) => equipment.id
      );
      try {
        const response = await this.$axios.delete(
          `job-schedules/${jobSchedule.id}`,
          {
            equipment_ids
          }
        );
        this.deleteMaintenancePlan();
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable to Delete Job Schedule"
        });
      }
    },
    async deleteMaintenancePlan() {
      let maintenancePlan = this.planToDelete;
      const { trades, equipmentSpecs, units } = maintenancePlan;
      const trade_ids = trades.map((trade) => trade.id);
      const equipment_specification_ids = equipmentSpecs.map(
        (equipmentSpec) => equipmentSpec.id
      );
      const units_id = units.map((unit) => unit.id);

      try {
        const response = await this.$axios.delete(
          `maintenance-plans/${maintenancePlan.id}`,
          {
            trade_ids,
            equipment_specification_ids,
            units_id
          }
        );
        this.disabled = false;
        this.$router.go();
        this.$store.commit("maintenance/maintenancePlans/toggleRefresh");
        this.toast({
          type: "info",
          title: "Schedule and Maintenance Plan Deleted"
        });
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable to Delete Maintenance Plan"
        });
      }
    },
    nextMaintenanceCycle(schedule) {
      if (schedule.cycles.length < 1) return {};
      return schedule.cycles.find(
        (cycle) => schedule.current_cycle_count == cycle.cycle_count
      );
    }
  },
  mixins: [authMixin, modalMixin],
  props: ["unit"]
};
</script>
