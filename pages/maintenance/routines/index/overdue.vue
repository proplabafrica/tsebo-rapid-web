<template>
  <v-paginate :list="maintenanceCycles" perPage="30" v-if="!loading">
    <template v-slot="paginate">
      <div class="table-responsive bg-white">
        <table class="table table-striped mg-b-0 tx-13">
          <thead>
            <tr class="tx-10">
              <th class="pd-y-5">Plan</th>
              <th class="pd-y-5">Frequency</th>
              <th class="pd-y-5">Location</th>
              <th class="pd-y-5">Due Date</th>
            </tr>
          </thead>
          <tbody v-if="paginate.list.length > 0">
            <tr v-for="cycle in paginate.list" :key="cycle.id">
              <td>
                <nuxt-link class="tx-inverse tx-bold d-block"
                  :to="`/maintenance/routines/maintenance-plans/details?id=${cycle.schedule.plan.id}`"
                  v-text="cycle.schedule.plan.name"></nuxt-link>
                <span v-text="cycle.schedule.plan.description"></span>
              </td>
              <td>
                <span v-text="
                  `${cycle.schedule.plan.frequency} ${cycle.schedule.plan.frequencyMeasurement.name}`
                "></span>
              </td>
              <td>
                <span class="d-block" v-for="(equipment, index) in cycle.schedule.equipmentList" :key="equipment.id">
                  <span class="tx-14 tx-bold d-block" v-text="`${equipment.code} - ${equipment.name}`"></span>
                  <nuxt-link class="tx-12 d-block tx-inverse" :to="`/location/units/details?id=${equipment.unit.id}`"
                    v-text="equipment.unit.name"></nuxt-link>
                  <hr class="mg-y-5" v-if="cycle.schedule.equipmentList.length > index + 1" />
                </span>
              </td>
              <td>
                <span>{{ (cycle.due_at * 1000) | dateFormat }}</span>
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
      </div>
    </template>
    <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
  </v-paginate>
  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getMaintenanceCycles();
  },
  data: () => ({
    loading: true,
    maintenanceCycles: []
  }),
  head: () => ({
    title: "Routines · Tsebo-Rapid"
  }),
  methods: {
    getMaintenanceCycles() {
      var {
        associations,
        maintenanceCycles,
        pagination,
        refresh
      } = this.$store.state.maintenance.maintenanceCycles;

      const { page, perPage } = pagination;

      if (refresh == false) {
        this.loading = false;
        return (this.maintenanceCycles = maintenanceCycles);
      }

      this.$axios
        .get("maintenance-cycles", {
          params: { associations, page, perPage }
        })
        .then((response) => {
          this.$store.commit(
            "maintenance/maintenanceCycles/setMaintenanceCycles",
            response.data.data
          );
          this.$store.commit(
            "maintenance/maintenanceCycles/setPagination",
            response.data
          );
          this.maintenanceCycles = this.$store.state.maintenance.maintenanceCycles.maintenanceCycles;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
      return true;
    }
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
