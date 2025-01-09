<template>
  <div class="mg-t-10 table-responsive" v-if="!facilityManagerSlasLoading">
    <table class="table table-striped">
      <thead>
        <tr>
          <td>
            Ranking
            <span class="cursor-pointer" @click="reverse()">&uarr; &darr;</span>
          </td>
          <td>FM Name</td>
          <td>Performance</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(fm, index) in facilityManagerSlas" :key="`facility-manager-${fm.id}`">
          <td>{{ index + 1 }}</td>
          <td>{{ fm.user.name }}</td>
          <td>
            {{
            (((fm.sla_completion_time.timelyRequests +
            fm.sla_response_time.timelyRequests) /
            (2 * fm.sla.count)) *
            100)
            | twoDP
            }}%
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <loading v-else />
</template>

<script>
import moment from "moment";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";

export default {
  components: { loading, vPaginate },
  created() {
    this.getFacilityManagerSlas();
  },
  data: () => ({
    facilityManagerSlas: [],
    facilityManagerSlasLoading: true
  }),
  head: () => ({
    title: "Facility Manager SLA Performance · Tsebo-Rapid"
  }),
  meta: {
    pageName: "slas.store"
  },
  methods: {
    customSort(a, b) {
      var aPerformance =
        ((a.sla_completion_time.timelyRequests +
          a.sla_response_time.timelyRequests) /
          (2 * a.sla.count)) *
        100;
      var bPerfomance =
        ((b.sla_completion_time.timelyRequests +
          b.sla_response_time.timelyRequests) /
          (2 * b.sla.count)) *
        100;

      aPerformance = aPerformance ? aPerformance : 0;
      bPerfomance = bPerfomance ? bPerfomance : 0;

      return bPerfomance - aPerformance;
    },
    dateToAYearAgo(date) {
      const aYearAgo = new Date(date.setFullYear(date.getFullYear() - 1));
      date = new Date(date.setFullYear(date.getFullYear() + 1));

      return {
        rangeFrom: moment(
          new Date(aYearAgo.getFullYear(), aYearAgo.getMonth(), 1)
        ).format("YYYY-MM-DD"),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format("YYYY-MM-DD")
      };
    },
    async getFacilityManagerSlas() {
      const dateRange = this.dateToAYearAgo(new Date());

      try {
        const response = await this.$axios.get(
          "reporting/facility-managers/work-request-sla",
          {
            params: {
              facilityManagerAssociations: ["units", "user"],
              facilityManagerPerPage: 300,
              workRequestRangeBy: "created_at",
              workRequestRangeFrom: dateRange.rangeFrom,
              workRequestRangeTo: dateRange.rangeTo
            }
          }
        );
        this.facilityManagerSlas = response.data.data.sort(this.customSort);
        this.facilityManagerSlasLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    reverse() {
      this.facilityManagerSlas.reverse();
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
