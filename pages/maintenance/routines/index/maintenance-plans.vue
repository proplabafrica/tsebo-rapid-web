<template>
  <v-paginate :list="maintenancePlans" perPage="30" v-if="!loading">
    <template v-slot="paginate">
      <div class="table-responsive bg-white">
        <table class="table table-striped mg-b-0">
          <thead>
            <tr class="tx-10">
              <th class="pd-y-5">#</th>
              <th class="pd-y-5">Description</th>
              <th class="pd-y-5">Frequency</th>
              <th class="pd-y-5">Trades</th>
              <th class="pd-y-5">Equipment</th>
              <th class="pd-y-5">Action</th>
            </tr>
          </thead>
          <tbody v-if="paginate.list.length > 0">
            <tr v-for="(plan, index) in paginate.list" :key="plan.id">
              <td v-text="index + 1"></td>
              <td>
                <nuxt-link class="tx-inverse tx-bold d-block"
                  :to="`/maintenance/routines/maintenance-plans/details?id=${plan.id}`" v-text="plan.name"></nuxt-link>
                <span v-text="plan.description"></span>
              </td>
              <td>
                <span v-text="`${plan.frequency} ${plan.frequencyMeasurement.name}`"></span>
              </td>
              <td>
                <span v-for="(trade, index) in plan.trades" :key="trade.id">{{ trade.name
                }}{{ plan.trades.length > index + 1 ? ", " : "" }}</span>
              </td>
              <td>
                <span class="d-block" v-for="(spec, index) in plan.equipmentSpecs" :key="spec.id">{{ spec.name
                }}{{
                  plan.equipmentSpecs.length > index + 1 ? ", " : ""
                  }}</span>
              </td>
              <td>
                <span v-modal-open="'delete-modal'" @click="planToDelete = plan">
                  <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                </span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="12">
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
                  Are you sure you want to delete this plan?
                </h4>
                <div class="form-layout-footer">
                  <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4" :disabled="disabled"
                    @click="deleteMaintenancePlan()">
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
    </template>
    <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
  </v-paginate>
  <loading v-else />
</template>


<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate, vModal, vButton },
  created() {
    this.getMaintenancePlans();
  },
  data: () => ({
    loading: true,
    maintenancePlans: [],
    planToDelete: null,
    disabled: false
  }),
  head: () => ({
    title: "Maintenance Plans · Tsebo-Rapid"
  }),
  meta: {
    pageName: "maintenance.routines.maintenance-plans.index"
  },
  methods: {
    async deleteMaintenancePlan() {
      let maintenancePlan = this.planToDelete;
      this.disabled = true;
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
    getMaintenancePlans() {
      var {
        associations,
        maintenancePlans,
        pagination,
        refresh
      } = this.$store.state.maintenance.maintenancePlans;

      const { page, perPage } = pagination;

      if (refresh == false) {
        this.loading = false;
        return (this.maintenancePlans = maintenancePlans);
      }

      this.$axios
        .get("maintenance-plans", {
          params: { associations, page, perPage }
        })
        .then((response) => {
          this.$store.commit(
            "maintenance/maintenancePlans/setMaintenancePlans",
            response.data.data
          );
          this.$store.commit(
            "maintenance/maintenancePlans/setPagination",
            response.data
          );
          this.maintenancePlans = this.$store.state.maintenance.maintenancePlans.maintenancePlans;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
      return true;
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, modalMixin]
};
</script>
