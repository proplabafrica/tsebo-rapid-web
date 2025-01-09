<template>
  <div>
    <div class="row row-xs">
      <div class="col-12 col-md mg-b-10 mg-md-b-0">
        <div class="card card-status">
          <div class="media">
            <i class="icon ion-ios-bolt-outline tx-danger"></i>
            <nuxt-link class="media-body tx-deco-none" to="/reports/incident-reports">
              <h1>{{ openIncidents }}</h1>
              <p>Incidents</p>
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- <div class="col-12 col-md mg-b-10 mg-md-b-0" v-show="false">
        <nuxt-link class="tx-deco-none" to="/performance/slas/performance-by-month">
          <div class="card card-status">
            <div class="media">
              <i class="icon ion-ios-checkmark-outline tx-teal"></i>
              <div class="media-body">
                <h1 v-if="months[0]">
                  {{
                    parseInt(
                      (months[0].approvalPerformance.timelyRequests /
                        months[0].approvalPerformance.count) *
                      100
                    )
                  }}%
                </h1>
                <p>{{ isClient ? "Client" : null }} Approval Performance</p>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div> -->
      <div class="col-12 col-md mg-b-10 mg-md-b-0">
        <nuxt-link class="tx-deco-none" to="/performance/slas/performance-by-month">
          <div class="card card-status">
            <div class="media">
              <i class="icon ion-ios-bookmarks-outline tx-teal"></i>

              <div class="media-body">
                <h1 v-if="months[0]">
                  {{ parseInt(
                (months[0].slaPerformance?.timelyRequests > 0 ? months[0].slaPerformance?.timelyRequests /
                  months[0].slaPerformance.count : 0) *
                100
              )
                  }}%
                </h1>
                <p>SLA Performance</p>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
      <div class="col col-md mg-b-10 mg-md-b-0" v-show="false">
        <div class="tx-deco-none" :style="{ cursor: 'pointer' }" v-on:click="openJobsPastSla">
          <div class="card card-status">
            <div class="media">
              <i class="icon ion-ios-list-outline tx-warning"></i>
              <div class="media-body">
                <h1 v-if="worksPastSla.length > 0">
                  <!-- {{ workRequests.length }} -->
                  {{ worksPastSla.length }}
                </h1>

                <p>Jobs Past SLA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md mg-b-10 mg-md-b-0">
        <div class="card card-status">
          <div class="media">
            <i class="ionicons ion-ios-person-outline tx-teal" style="font-size: 57px">
            </i>
            <div class="media-body">
              <h1 v-if="ratings.length">
                {{
                isNaN(ratingByParameter("client-satisfaction"))
                  ? "0%"
                  : ((ratingByParameter("client-satisfaction") * 100)
                    | twoDP) +
                  "%"
              }}
              </h1>
              <p>Overall Technicians Performance.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md mg-b-10 mg-md-b-0">
        <nuxt-link class="tx-deco-none" :to="'/performance/slas/fm-performance'">
          <div class="card card-status">
            <div class="media">
              <i class="icon ion-ios-checkmark-outline tx-teal"></i>

              <div class="media-body">
                <h1 v-if="!fmLoading">
                  {{ totalActiveFms }} Active
                </h1>
                <p>FM Performance</p>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>


    <div>
      <div class="row row-xs mg-t-10 mg-b-10">
        <div class="mg-b-10 mg-md-b-0">
          <div class="tx-deco-none" :style="{ cursor: 'pointer' }">
            <div class="w-100 card card-status card-height shadow-sm mg-r-10">
              <div class="media">
                <i class="icon ion-ios-list-outline tx-warning"></i>
                <div class="media-body w-100">
                  <expenses :monthStartAndEnd="monthStartAndEnd" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <create-request />

      </div>


    </div>
    <div class="row row-xs">
      <div class="col-12 col-md mg-b-10 mg-md-b-0">

        <approvalRequestData />
      </div>

      <div class="col-12 col-md mg-b-10 mg-md-b-0">
        <div class="container-sm ">
          <div class="row row-xs d-flex flex-column">
            <div class="float-right mg-b-10">
              <div class="card-header" :style="{ backgroundColor: '#e3e7f2' }">
                <h6 class="slim-card-title">Approved Requests Chart</h6>
              </div>
              <div v-if="!reportLoading">
                <performance-chart :approvalMonths="approvalMonths" :workOrderCompletedInSla="workOrderCompletedInSla"
                  :workOrderCompletedOutOfSla="workOrderCompletedOutOfSla" :workOrders="workOrders"
                  :slaPerformance="slaPerformance" />
              </div>
              <loading v-else />
            </div>
          </div>
          <completedRequestData />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from "v-calendar/lib/components/calendar.umd";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";
import vPaginate from "@/components/ui/paginate";
import quickRequestData from "@/components/maintenance/requests/quick-data";
import moment from "moment";
import { mapActions } from "vuex";
import slaMixin from "@/mixins/performance/sla";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import performanceChart from "@/components/ui/performance-chart";
import expenses from "@/components/performance/slas/expenses";
import createRequestForm from "@/components/maintenance/requests/create";
import completedRequestData from "@/components/maintenance/requests/status-table/completed-request-column";
import approvalRequestData from "@/components/maintenance/requests/status-table/approval-request-column";

export default {
  components: {
    loading,
    quickRequestData,
    vPaginate,
    vModal,
    Calendar,
    DatePicker,
    performanceChart,
    expenses,
    createRequestForm,
    completedRequestData,
    approvalRequestData,
    "create-request": () =>
      import("@/components/maintenance/requests/status-table/create-modal"),
  },

  created() {
    this.getTotalActiveFMS()
    this.setMonths();
    this.getData();
    this.$store.commit("maintenance/workRequests/toggleRefresh");
    this.getWorkRequests(this);

    this.setUser(this.id);

  },

  data: () => ({
    range: {
      start: null,
      end: null,
    },
    showDatePicker: false,
    approvalMonths: [],
    months: [],
    workPastSla: 0,
    worksPastSla: [],
    numberOfMonthsBack: 12,
    rangeBy: "updated_at",
    reportLoading: true,
    // workRequestStatusCodes: [],
    maintenanceTypeCodes: [],
    workRequests: [],
    worksPastSlaForEachMonth: [],
    worksPastSlaPerMonth: 0,
    workRequestsLoading: true,
    workRequestsSortBy: "updated_at",
    workRequestsSortOrder: "desc",
    disabled: false,
    user: null,
    userLoading: true,
    shouldRefresh: true,
    openWorkPastSla: 0,
    currentMonthApprovalPersformance: null,
    currentMonthSla: null,
    clientSatisfaction: null,
    openIncidents: 0,
    ratings: [],
    id: null,
    ratingsLoading: true,
    rateableCodes: ["work_requests"],
    workRequestStatusCodes: ["60", "65", "80"],
    isClient: false,
    showCalender: false,
    showDropDownTab: false,
    requestsLoading: true,
    workOrderCompletedInSla: [],
    workOrderCompletedOutOfSla: [],
    slaPerformance: [],
    workOrders: [],
    totalActiveFms: 0,
    loading: false,
    fmLoading: false,
  }),

  methods: {

    ...mapActions({
      getWorkRequests: "maintenance/workRequests/getWorkRequests",

    }),
    /************************************************** */
    onChange(event) {
      const code = event.target.value;

      if (code !== "all") {
        const maintenanceTypeCodes = [];

        maintenanceTypeCodes.push(code);
        this.setMonths(maintenanceTypeCodes);
        return;
      }
      this.setMonths();
    },
    monthStartAndEnd(date) {
      return {
        name: moment(date).format("MMMM YYYY"),
        rangeFrom: moment(
          new Date(date.getFullYear(), date.getMonth(), 1)
        ).format("YYYY-MM-DD h:mm:ss"),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format("YYYY-MM-DD h:mm:ss"),
      };
    },
    async setMonths(maintenanceTypeCodes) {
      this.months = [];

      if (typeof maintenanceTypeCodes === "undefined") {
        maintenanceTypeCodes = ["corrective", "preventive"];
      }

      var currentDate = new Date();
      for (var index = 0; index < 7; index++) {
        const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
          currentDate
        );

        const [slaPerformance, approvalPerformance] = await Promise.all([
          this.getSlaPerformance({
            rangeFrom,
            rangeTo,
            maintenanceTypeCodes,
          }),
          this.getSlaPerformance({
            allotedPercentageTime: 20,
            rangeFrom,
            rangeTo,
            slaStatusCodes: ["35", "105"],
            maintenanceTypeCodes,
          }),

        ]);



        this.months.push({
          approvalPerformance,
          slaPerformance,
          name,
          rangeFrom,
          rangeTo,
        });

        // clock in 5 days to previous month
        currentDate = new Date(rangeFrom);
        currentDate.setDate(currentDate.getDate() - 5);
      }

      this.months.map((month) => {

        this.approvalMonths.push(month.name);
        this.workOrderCompletedInSla.push(month.slaPerformance.timelyRequests);
        this.workOrderCompletedOutOfSla.push(
          month.slaPerformance.count - month.slaPerformance.timelyRequests
        );
        this.workOrders.push(month.slaPerformance.count)


      });

      this.reportLoading = false;
      this.$store.commit(
        "performance/slaReports/setMonthOnMonthData",
        JSON.parse(JSON.stringify(this.$data))
      );
    },

    async getTotalActiveFMS() {
      try {
        this.fmLoading = true
        const resp = await this.$axios.get('fm-performance/active-fms')

        this.totalActiveFms = resp.data.total
        this.fmLoading = false

      } catch (error) {
        this.fmLoading = false

        console.log(error)
      }
    },
    /************************************************************** */

    async setUser(id) {
      const { detailedAssociations, users } = this.$store.state.people.users;
      this.user = users.find((user) => user.id == id);
      if (this.user && !this.shouldRefresh) return (this.userLoading = false);

      try {
        const user = (
          await this.$axios.get("users/" + id, {
            params: { associations: detailedAssociations },
          })
        ).data.user;

        // this.$store.commit("people/users/setUser", user);
        this.user = this.user ? Object.assign({}, user) : user;
        this.id = user.id;
        this.userLoading = false;
        this.shouldRefresh = false;
        // this.$store.commit("people/users/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },

    updateUser() {
      this.shouldRefresh = true;
      this.userLoading = true;
      this.setUser(this.user.id);
    },
    openJobsPastSla() {
      if (this.workRequests && this.worksPastSla.length == 0) {
        for (var i = 0; i < this.workRequests.length; i++) {
          if (
            this.workRequests[i].slaInfo &&
            !this.workRequests[i].status.name.includes("complete") &&
            this.workRequests[i].slaInfo.timeExpended >
            this.workRequests[i].slaInfo.expectedDuration
          ) {
            this.worksPastSla.push(this.workRequests[i]);
          }
        }
      }
      if (this.openWorkPastSla == 0) {
        this.openWorkPastSla = 1;
        this.worksPastSlaPerMonth = 0;
      } else {
        this.openWorkPastSla = 0;
        this.worksPastSlaPerMonth = 0;
      }
    },
    getJobsPastSlaForMonth(event) {
      if (event.target.value) {
        let month;

        month = `"${event.target.value}"`;

        let monthToArr = month.split(" ");
        this.worksPastSlaPerMonth = 1;
        this.worksPastSlaForEachMonth = [];

        for (var i = 0; i < this.workRequests.length; i++) {
          var date = `"${new Date(this.workRequests[i].created_at)}"`;
          var dateArray = date.split(" ");
          if (
            monthToArr[0].includes(dateArray[1]) &&
            monthToArr[1].includes(dateArray[3])
          ) {
            this.worksPastSlaForEachMonth.push(this.workRequests[i]);
          }
        }
      }
    },

    ...mapActions({
      getRatings: "performance/ratings/getRatings",
    }),
    async getData() {
      var roles = this.$store.state.auth.user.roles;
      this.id = this.$store.state.auth.user.id;
      roles = roles.filter((role) => role.code == "OCC");
      this.isClient = roles.length > 0;

      const { statusTabData } = Object.assign(
        {},
        this.$store.state.performance.slaReports
      );

      if (statusTabData) {
        this.currentMonthApprovalPerformance =
          statusTabData.currentMonthApprovalPerformance;
        this.currentMonthSla = statusTabData.currentMonthSla;
        this.clientSatisfaction = statusTabData.clientSatisfaction;
        this.openIncidents = statusTabData.openIncidents;
        this.ratings = statusTabData.ratings;
        this.ratingsLoading = statusTabData.ratingsLoading;
        this.rateableCodes = statusTabData.rateableCodes;
        this.workRequestStatusCodes = statusTabData.workRequestStatusCodes;
        return;
      }
      this.getOpenIncidents();
      this.getRatings(this);

      const { rangeFrom, rangeTo } = this.monthStartAndEnd(new Date());
      const [currentMonthSla, currentMonthApprovalPerformance] =
        await Promise.all([
          this.getSlaPerformance({
            rangeFrom,
            rangeTo,
            allotedPercentageTime: 80,
          }),
          this.getSlaPerformance({
            allotedPercentageTime: 20,
            rangeFrom,
            rangeTo,
            slaStatusCodes: ["35", "105"],
          }),
        ]);
      this.currentMonthSla = currentMonthSla;
      this.currentMonthApprovalPerformance = currentMonthApprovalPerformance;
      // this.$store.commit("performance/slaReports/setStatusTabData", this.$data);
    },
    async getOpenIncidents() {
      try {
        const response = await this.$axios.get(
          "incident-reports/get-count",
          {}
        );
        this.openIncidents = response.data.count;
      } catch (error) {
        console.log(error);
      }
    },
    monthStartAndEnd(date) {
      return {
        name: moment(date).format("MMMM YYYY"),
        rangeFrom: moment(
          new Date(date.getFullYear(), date.getMonth(), 1)
        ).format("YYYY-MM-DD h:mm:ss"),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format("YYYY-MM-DD h:mm:ss"),
      };
    },
    ratingByParameter(parameterCode) {
      const totalScore = this.ratings.reduce(
        (total, rating) => total + parseFloat(rating.rating),
        0
      );
      const totalAchievable = this.ratings.reduce(
        (total, rating) => total + parseFloat(rating.max_rating),
        0
      );
      if (totalAchievable == 0 || totalScore == 0) return 0;

      return totalScore / totalAchievable;
    },
    slaDuration(sla) {
      const timeUnits = this.getTimeUnitsInSeconds([
        "minutes",
        "hour",
        "day",
        "week",
        "year",
      ]);
      if (sla) {
        if (sla.measurement == null) return 0;
        else if (!sla.expected_time) return 0;

        return (
          parseFloat(sla.expected_time) *
          timeUnits.find(
            (unit) => unit.name == sla.measurement.code.slice(0, -1)
          ).value *
          1000
        );
      }
    },
    getCompletedTimeExpended(workRequest) {
      let requestTime;

      for (let i = 0; i < workRequest.logs.length; i++) {
        if (workRequest.logs[i].status.code == 65) {
          requestTime = workRequest.logs[i].created_at;
        }
      }

      if (!requestTime) return 0;
      else if (!workRequest.created_at) return 0;
      return Date.parse(requestTime) - Date.parse(workRequest.created_at);
    },
    getWorkPast(workRequest) {
      let work =
        this.slaDuration(workRequest.sla) -
        this.getCompletedTimeExpended(workRequest);
      if (!work) return 0;
      return work;
    },
  },
  middleware: ["auth", "roleGuard"],
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) return this.setUser(to.query.id);
    },
  },
  mixins: [slaMixin, authMixin, modalMixin],
};
</script>

<style scoped>
.wrapper {
  position: fixed;
  background-color: rgba(29, 28, 28, 0.438);
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
}

.container {
  overflow-y: scroll;
  margin-top: 20px;
  min-height: 30%;
  width: 95%;
  margin-bottom: 20px;
  background-color: white;
}

.select-month {
  width: 300px;
  margin: 20px 5px;
}

.no-data {
  font-size: 20px;
}

.calender {
  box-shadow: 10px 60px 100px 0px rgba(15, 14, 14, 0.1);
  position: absolute;
  left: 25px;
  top: 70px;
  z-index: 300;
  display: none;
  /* background-color:red; */
}

.show {
  display: block;
}

/* .approve{
  position: relative;
  bottom: 350px;
}
.approve-request{
  position: relative;
  bottom: 150px;
} */
</style>
