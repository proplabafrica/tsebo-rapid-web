<template>
  <div class="table-responsive" v-if="true">
    <div style="width: 20%; float: right; margin-top: 10px; margin-bottom: 10px">
      <select name="maintenance_type" @change="onChange($event)" class="form-control">
        <option value="all" selected>All</option>
        <option value="corrective">Corrective</option>
        <option value="preventive">Preventive</option>
        <option value="project">Project</option>
      </select>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Month</th>
          <th>Number Of Completed Work Orders</th>
          <th>SLA Percentage Compliance</th>
          <th>Approval Percentage Compliance</th>
          <!-- <th>Work Request</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="month in months" :key="month.name">
          <td>{{ month.name }}</td>
          <td>{{ month.slaPerformance.count }}</td>
          <td>
            <span v-if="month.slaPerformance.count">{{
            ((month.slaPerformance.timelyRequests /
            month.slaPerformance.count) *
            100)
            | twoDP
            }}%
            </span>
            
            <span v-else>N/A</span>
          </td>
          <td>
            <span v-if="month.approvalPerformance.count">{{
            ((month.approvalPerformance.timelyRequests /
            month.approvalPerformance.count) *
            100)
            | twoDP
            }}%</span>
            <span v-else>N/A</span>
          </td>
          <!-- <td>
            <span v-if="month.approvalPerformance.count">
              <ul v-for="month in month.approvalPerformance.workReadyForReview" :key="month.name">
                <li>{{ month.name }}</li>
              </ul>
            </span>
            <span v-else>N/A</span>
          </td> -->
        </tr>
        <tr v-if="reportLoading">
          <td class="tx-center" colspan="5">
            <loading />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import loading from '@/components/ui/loading'
import authMixin from '@/mixins/auth'
import slaMixin from '@/mixins/performance/sla'

export default {
  components: { loading },
  created() {
    this.setMonths()
  },
  data: () => ({
    months: [],
    numberOfMonthsBack: 12,
    // rangeBy: 'updated_at',
    reportLoading: true,
    workRequestStatusCodes: [],
    maintenanceTypeCodes: []
  }),
  head: () => ({
    title: 'SLA Performance By Month · Tsebo-Rapid'
  }),
  meta: {
    pageName: 'slas.store'
  },
  methods: {
    onChange(event) {
      const code = event.target.value

      if (code !== 'all') {
        const maintenanceTypeCodes = []

        maintenanceTypeCodes.push(code)
        this.setMonths(maintenanceTypeCodes)
        return
      }
      this.setMonths()
    },
    monthStartAndEnd(date) {
      return {
        name: moment(date).format('MMMM YYYY'),
        rangeFrom: moment(
          new Date(date.getFullYear(), date.getMonth(), 1)
        ).format('YYYY-MM-DD h:mm:ss'),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format('YYYY-MM-DD h:mm:ss')
      }
    },
    async setMonths(maintenanceTypeCodes) {
      const monthOnMonthData = this.$store.state.performance.slaReports
        .monthOnMonthData
      this.months = []

      // "all the months in the sla...", this.months);

      // if (monthOnMonthData) {
      //   this.months = monthOnMonthData.months;
      //   this.reportLoading = monthOnMonthData.reportLoading;
      //   return;
      // }

      if (typeof maintenanceTypeCodes === 'undefined') {
        maintenanceTypeCodes = ['corrective', 'preventive', 'project']
      }

      var currentDate = new Date()
      for (var index = 0; index < 12; index++) {
        const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
          currentDate
        )
        this.$store.commit('maintenance/workRequests/toggleRefresh')

        const [slaPerformance, approvalPerformance] = await Promise.all([
          this.getSlaPerformance({
            rangeFrom,
            rangeTo,
            maintenanceTypeCodes
          }),
          this.getSlaPerformance({
            allotedPercentageTime: 20,
            rangeFrom,
            rangeTo,
            slaStatusCodes: ['35', '105'],
            maintenanceTypeCodes
          })
        ])

        if (slaPerformance.count > 0)
          this.months.push({
            approvalPerformance,
            slaPerformance,
            name,
            rangeFrom,
            rangeTo
          })

        // clock in 5 days to previous month
        currentDate = new Date(rangeFrom)
        currentDate.setDate(currentDate.getDate() - 5)
      }
      this.reportLoading = false
      this.$store.commit(
        'performance/slaReports/setMonthOnMonthData',
        JSON.parse(JSON.stringify(this.$data))
      )
    }
  },
  computed: {},
  middleware: ['auth', 'roleGuard'],
  mixins: [authMixin, slaMixin]
}
</script>
