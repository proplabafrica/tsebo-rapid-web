<template>
  <div class="mg-t-10 table-responsive" v-if="!tradeSLAsLoading">
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
        <tr v-for="(trade, index) in tradeSLAs" :key="`facility-manager-${trade.id}`">
          <td>{{ index + 1 }}</td>
          <td>{{ trade.name }}</td>
          <td>
            {{
            (((trade.sla_completion_time.timelyRequests +
            trade.sla_response_time.timelyRequests) /
            (2 * trade.sla.count)) *
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
    this.getTradeSLAs();
  },
  data: () => ({
    tradeSLAs: [],
    tradeSLAsLoading: true
  }),
  head: () => ({
    title: "Trade SLA Performance · Tsebo-Rapid"
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
    async getTradeSLAs() {
      const dateRange = this.dateToAYearAgo(new Date());

      try {
        const response = await this.$axios.get(
          "reporting/trades/work-request-sla",
          {
            params: {
              rangeBy: "created_at",
              from: dateRange.rangeFrom,
              to: dateRange.rangeTo
            }
          }
        );
        this.tradeSLAs = response.data.data.sort(this.customSort);
        this.tradeSLAsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    reverse() {
      this.tradeSLAs.reverse();
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
