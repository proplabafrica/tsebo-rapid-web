<template>
  <div>
    <v-paginate
      :list="filteredCycles"
      perPage="30"
      v-if="!maintenanceCyclesLoading"
    >
      <template v-slot="paginate">
        <!-- Search bar -->
        <span class="d-flex flex-column float-left">
          <input
            type="text"
            placeholder="Search Job"
            class="form-control wd-200 mg-t-5 mg-b-10 mg-x-0 float-left"
            v-model="cycleListSearch"
          />
        </span>

        <!-- <v-button
          type="button"
          class="btn btn-danger pd-x-25"
          @click="getExpiredDate()"
        >
          <i class="icon ion-ios-checkmark-outline"></i> Delete
        </v-button> -->

        <!-- Filter bar -->
        <span class="d-flex flex-column float-right">
          <select
            class="form-control wd-200 mg-t-5 mg-b-0 tx-capitalize"
            name="`hierarchy-`"
            v-model="facility"
          >
            <option :value="null">
              {{ facility ? "Show All" : "Filter By Location" }}
            </option>
            <option
              v-for="(facility, index) in facilities"
              :key="`facility-${index}`"
              :value="facility"
            >
              {{ facility }}
            </option>
          </select>
        </span>

        <div class="table-responsive bg-white">
          <table class="table table-striped mg-b-0 tx-13">
            <thead>
              <tr class="tx-10">
                <th class="pd-y-5">Plan</th>
                <th class="pd-y-5">Frequency</th>
                <th class="pd-y-5">Location</th>
                <th class="pd-y-5">Start Date</th>
                <th class="pd-y-5">Due Date</th>
                <th class="pd-y-5">Date Created</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="cycle in paginate.list" :key="cycle.id">
                <td>
                  <nuxt-link
                    class="tx-inverse tx-14 tx-bold d-block"
                    v-if="cycle.schedule"
                    :to="`/maintenance/routines/job-schedules/details?id=${cycle.schedule.id}`"
                    v-text="cycle.schedule.plan.name"
                  ></nuxt-link>
                  <span
                    v-if="cycle.schedule"
                    v-text="cycle.schedule.plan.description"
                  ></span>
                </td>
                <td>
                  <span
                    v-if="cycle.schedule"
                    v-text="
                      `${cycle.schedule.plan.frequency} ${cycle.schedule.plan.frequencyMeasurement.name}`
                    "
                  ></span>
                </td>
                <td v-if="!cycle.schedule.equipmentList.length == 0">
                  <span
                    class="d-block"
                    v-for="(equipment, index) in cycle.schedule.equipmentList"
                    :key="index"
                  >
                    <span
                      class="tx-14 tx-bold d-block"
                      v-text="`${equipment.code} - ${equipment.name}`"
                    ></span>
                    <nuxt-link
                      class="tx-12 d-block tx-inverse"
                      :to="`/location/units/details?id=${cycle.schedule.unit.id}`"
                      v-text="equipment.unit.name"
                    ></nuxt-link>
                    <hr
                      class="mg-y-5"
                      v-if="cycle.schedule.equipmentList.length > index + 1"
                    />
                  </span>
                </td>
                <td v-else-if="cycle.schedule.equipmentList.length == 0">
                  <nuxt-link
                    class="tx-12 d-block tx-inverse"
                    :to="`/location/units/details?id=${cycle.schedule.unit.id}`"
                    v-text="cycle.schedule.unit.name"
                  ></nuxt-link>
                </td>
                <td>
                  <div>
                    {{ (cycle.schedule.started_at * 1000) | dateFormat }}
                  </div>
                </td>
                <td>
                  <div>
                    {{ (cycle?.due_at * 1000) | dateFormat }}
                  </div>
                  <!-- <div>
                    {{ (cycle?.due_at * 1000) | dateFormat }}
                  </div> -->
                </td>
                <td>
                  <span>{{
                    new Date(cycle.schedule.created_at).getTime() | dateFormat
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
      <template
        v-slot:linksWrapper
        class="card-footer tx-13 pd-y-15 bg-transparent"
      ></template>
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getData();
    // await this.getExpiredDate()
  },
  async mounted() {
    this.getTimeLength()
    // await this.getExpiredDate()
    // this.getStartedTime()
    // this.filteredItems();
  },
  updated() {
    this.setFacilities();
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
        // return lifeDrama;
      },
      set(newValue) {
        this.cycles = newValue;
      }
    }
  },
  data: () => ({
    maintenanceCycles: [],
    maintenanceCyclesLoading: true,
    maintenanceCyclesSortBy: "updated_at",
    maintenanceCyclesSortOrder: "desc",
    facility: null,
    facilities: [],
    cycleListSearch: null,
    cycles: [],
    items: [],
    filteredItem: null,
    cycleListId: null,
  }),
  head: () => ({
    title: "Routines · VampFi"
  }),
  methods: {
    ...mapActions({
      getMaintenanceCycles: "maintenance/maintenanceCycles/getMaintenanceCycles"
    }),
    filteredItems() {
      this.populateItems();
      let unique = [];
      for (let item of this.items) {
        const isDuplicate = unique.find(
          (obj) => obj?.schedule?.plan?.name === item?.schedule?.plan?.name
        );
        if (!isDuplicate) {
          unique.push(item);
        }
      }
      this.filteredItem = unique;
      return unique;
    },
    nextDueDate(cycle) {
      let freq = cycle.schedule.plan.frequency;
      let freqMeas = cycle.schedule.plan.frequencyMeasurement.code;
      let nextDueDate =
        cycle?.schedule.started_at + this.timeToSeconds(freq, freqMeas);
      return nextDueDate;
    },
    nextDueTime(cycle) {
      let freq = cycle.schedule.plan.frequency;
      let freqMeas = cycle.schedule.plan.frequencyMeasurement.code;
      let nextDueDate = cycle?.due_at + this.timeToSeconds(freq, freqMeas);
      return nextDueDate;
    },
    timeToSeconds(value, unit) {
      const timeValues = {
        seconds: 1,
        minutes: 60,
        hours: 60 * 60,
        days: 60 * 60 * 24,
        weeks: 60 * 60 * 24 * 7,
        years: 60 * 60 * 24 * 365.25
      };

      return parseFloat(value) * timeValues[unit];
    },
    getCompletedTime() {
      // this.filteredItems();
      let newFiltered = this.filteredItem;
      let resultsArray;
      let count = 0;

      for (const cycle of newFiltered) {
        while (cycle?.schedule.started_at <= cycle?.new_date) {
          let freq = cycle.schedule.plan.frequency;
          let freqMeas = cycle.schedule.plan.frequencyMeasurement.code;
          resultsArray =
            cycle?.schedule.started_at + this.timeToSeconds(freq, freqMeas);
          // return nextDueDate;
          // count++;
        }
      }
    },

    getStartedTime() {
      let result;
      let count = 0;

      for (let cycle of this.items) {
        if (cycle?.schedule.started_at > cycle?.new_date) {
          let freq = cycle.schedule.plan.frequency;
          let freqMeas = cycle.schedule.plan.frequencyMeasurement.code;
          result =
            cycle?.schedule.started_at + this.timeToSeconds(freq, freqMeas);
          // return nextDueDate;
          count++;
        }
        let sliceNumber = (num, len) => +String(num).slice(0, len);

        let new_date = sliceNumber(result, 10);
        // "object", new_date);

        Object.assign(cycle, {
          cycle_item: new_date
        });
      }
      return { result, count };
    },
    setFacilities() {
      const facilitiesSet = new Set(
        this.maintenanceCycles.map((cycle) => cycle.schedule.unit.name)
      );

      this.facilities = Array.from(facilitiesSet);
    },
    populateItems() {
      for (const item of this.maintenanceCycles) {
        let dueTime = this.nextDueDate(item);

        let next_due_time = this.nextDueTime(item);
        let sliceNumber = (num, len) => +String(num).slice(0, len);

        let new_date = sliceNumber(Date.now(), 10);

        this.items.push(
          Object.assign(item, {
            cycle_life: dueTime,
            next_due_at: next_due_time,
            new_date: new_date
          })
        );
      }
      return this.items;
    },
    async getData() {
      await this.getMaintenanceCycles(this);
      await this.setFacilities();

      this.maintenanceCycles = this.maintenanceCycles.filter(
        (cycle) => cycle.work_request_completed_at == null
      );
      this.filteredItems();

      // lifeDrama = Object.assign(...this.cycles, {cycle_life: cycleLife})

      this.cycles = this.filteredItem;

      await this.getExpiredDate()
    },
    async getCompletedDate() {
      try {
        this.populateItems();
        let uniqueArray = [];
        let uniqueId = [];
        for (let cycle of this.cycles) {
          if (cycle.new_date > cycle.due_at) {
            uniqueArray.push(cycle)
            uniqueId.push(cycle.id)
          }
        }
        this.cycleListId = uniqueId;
        return uniqueArray;
      } catch (error) {
        console.log(error);
      }
    },
    getTimeLength(){
      this.getExpiredDate()
      if ((Array.isArray(this.cycleListId) && this.cycleListId.length > 0)) {
        this.getExpiredDate()
      }
    },
    async getExpiredDate() {
      try {
        await this.getCompletedDate();

        const cycle_date_id = this.cycleListId;

        if (
          Array.isArray(cycle_date_id) &&
          cycle_date_id.length > 0
        ) {

          const response = await this.$axios.post("maintenance-cycles/completed-to-cycle", {
            cycle_date_id
          });

          let cycle_data = response.data.responseArray;
        }


      } catch (error) {
        console.log(error.message);
      }
    },
    searchCycles() {
      this.maintenanceCyclesLoading = true;

      this.filteredCycles = this.maintenanceCycles.filter((cycle) => {
        return (
          cycle.schedule.plan.name
            .toLowerCase()
            .indexOf(this.cycleListSearch.toLowerCase()) > -1
        );
      });
      this.maintenanceCyclesLoading = false;
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
