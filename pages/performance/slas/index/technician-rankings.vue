<template>
  <div class="mg-t-10 table-responsive" v-if="!techniciansLoading">
    <table class="table table-striped">
      <thead>
        <tr>
          <td>
            Ranking
            <b class="cursor-pointer" @click="reverse()">&uarr; &darr;</b>
          </td>
          <td>Trade</td>
          <td>Performance</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(technician, index) in technicians" :key="`facility-manager-${technician.id}`">
          <td>{{ index + 1 }}</td>
          <td>{{ technician.user.name }}</td>
          <td>{{ ((technician.rating / 5) * 100) | twoDP }}%</td>
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
    this.getTechnicianRankings();
  },
  data: () => ({
    technicians: [],
    techniciansLoading: true
  }),
  head: () => ({
    title: "Trade SLA Performance · Tsebo-Rapid"
  }),
  meta: {
    pageName: "slas.store"
  },
  methods: {
    customSort(a, b) {
      var aPerformance = (a.rating / 5) * 100;
      var bPerfomance = (b.rating / 5) * 100;

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
    async getTechnicianRankings() {
      const dateRange = this.dateToAYearAgo(new Date());

      try {
        const response = await this.$axios.get(
          "reporting/technicians/customer-satisfaction",
          {
            params: {
              rangeBy: "created_at",
              from: dateRange.rangeFrom,
              to: dateRange.rangeTo
            }
          }
        );
        this.technicians = response.data.data.sort(this.customSort);
        this.techniciansLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    reverse() {
      this.technicians.reverse();
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
