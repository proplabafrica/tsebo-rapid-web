<template>
  <v-paginate :list="filteredCycles" perPage="30" v-if="!loading">
    <template v-slot="paginate">
      <!-- Search bar -->
      <span class="d-flex flex-column float-left">
        <input type="text" placeholder="Search Job" class="form-control wd-200 mg-t-5 mg-b-10 mg-x-0 float-left"
          v-model="cycleListSearch" />
      </span>

      <!-- Filter bar -->
      <span class="d-flex flex-column float-right">
        <select class="form-control wd-200 mg-t-5 mg-b-0 tx-capitalize" name="`hierarchy-`" v-model="facility">
          <option :value="null">
            {{ facility ? "Show All" : "Filter By Location" }}
          </option>
          <option v-for="(facility, index) in facilities" :key="`facility-${index}`" :value="facility">
            {{ facility }}
          </option>
        </select>
      </span>

      <div class="table-responsive bg-white">
        <table class="table table-striped mg-b-0 tx-13">
          <thead>
            <tr class="tx-10">
              <th class="pd-y-5">Plan</th>
              <th class="pd-y-5">Job Cycle</th>
              <th class="pd-y-5">Frequency</th>
              <th class="pd-y-5">Location</th>
              <th class="pd-y-5">Date Completed</th>
            </tr>
          </thead>
          <tbody v-if="paginate.list.length > 0">
            <tr v-for="cycle in paginate.list" :key="cycle.id">
              <td v-if="cycle.schedule">
                <nuxt-link class="tx-inverse tx-bold d-block"
                  :to="`/maintenance/routines/job-schedules/details?id=${cycle.schedule.id}`"
                  v-text="cycle.schedule.plan.name"></nuxt-link>
                <!-- <nuxt-link
                  class="tx-inverse tx-bold d-block"
                  :to="`/maintenance/routines/maintenance-plans/details?id=${cycle.schedule.plan.id}`"
                  v-text="cycle.schedule.plan.name"
                ></nuxt-link> -->
                <span v-text="cycle.schedule.plan.description"></span>
              </td>
              <td v-if="cycle.schedule">
                <span v-text="`Cycle # ${cycle.cycle_count}`"></span>
              </td>
              <td v-if="cycle.schedule">
                <span v-text="
                  `${cycle.schedule.plan.frequency} ${cycle.schedule.plan.frequencyMeasurement.name}`
                "></span>
              </td>
              <td v-if="cycle.schedule">
                <span class="d-block">
                  <nuxt-link class="tx-inverse d-block" :to="`/location/units/details?id=${cycle.schedule.unit.id}`">
                    {{ cycle.schedule.unit.name }}
                  </nuxt-link>
                </span>
              </td>
              <td v-if="cycle.schedule">
                <span>{{
                (cycle.work_request_completed_at * 1000) | dateFormat
                }}</span>
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
    this.getData();
  },
  updated() {
    this.setFacilities();
  },
  data: () => ({
    loading: true,
    maintenanceCycles: [],
    maintenanceCyclesLoading: true,
    completed: true,
    facility: null,
    facilities: [],
    cycleListSearch: null,
    cycles: []
  }),
  head: () => ({
    title: "Routines · Tsebo-Rapid"
  }),
  methods: {
    setFacilities() {
      const facilitiesSet = new Set(
        this.maintenanceCycles
          .filter((cycle) => cycle.schedule != null)
          .map((cycle) => cycle.schedule.unit.name)
      );

      this.facilities = Array.from(facilitiesSet);
    },
    async getData() {
      await this.getMaintenanceCycles();
      await this.setFacilities();
    },
    async getMaintenanceCycles() {
      this.loading = true;
      var { associations, maintenanceCycles, pagination, refresh } =
        this.$store.state.maintenance.maintenanceCycles;

      const { page, perPage } = pagination;

      this.$axios
        .get("maintenance-cycles", {
          params: { associations, page, perPage, completed: this.completed }
        })
        .then((response) => {
          this.$store.commit(
            "maintenance/maintenanceCycles/setPagination",
            response.data
          );
          this.maintenanceCycles = response.data.data;
          this.cycles = this.maintenanceCycles;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
      return true;
    }
  },
  computed: {
    filteredCycles: {
      get() {
        if (!this.facility) {
          return this.cycles;
        } else {
          this.maintenanceCyclesLoading = true;
          this.cycles = this.maintenanceCycles.filter((cycle) => {
            return cycle.schedule.unit.name == this.facility;
          });
          this.maintenanceCyclesLoading = false;
        }

        return this.cycles;
      },
      set(newValue) {
        this.cycles = newValue;
      }
    }
  },
  middleware: ["auth"],
  mixins: [authMixin],
  watch: {
    cycleListSearch(search) {
      this.cycles = this.maintenanceCycles;
      this.debounce(() => {
        this.maintenanceCyclesLoading = true;
        if (!search) {
          this.filteredCycles = this.maintenanceCycles;
        }
        this.cycles = this.maintenanceCycles.filter((cycle) => {
          return (
            cycle.schedule.plan.name
              .toLowerCase()
              .indexOf(this.cycleListSearch.toLowerCase()) > -1
          );
        });
        this.filteredCycles = this.cycles;
        this.maintenanceCyclesLoading = false;
      }, 300);
    }
  }
};
</script>
