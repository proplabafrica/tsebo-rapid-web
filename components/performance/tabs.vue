<template>
  <div>
    <div class="row row-xs">
      <div class="col-12 col-md mg-b-10 mg-md-b-0">
        <div class="card card-status">
          <div class="media">
            <i class="icon ion-ios-bolt-outline tx-danger"></i>
            <nuxt-link
              class="media-body tx-deco-none"
              to="/reports/incident-reports"
            >
              <h1>{{ openIncidents }}</h1>
              <p>Incidents</p>
            </nuxt-link>
          </div>
        </div>
      </div>
      <!-- <div v-for="work in workRequests" :key="work.id">
        {{ work.created_at | dateFormat }}
      </div> -->

      <div class="col-12 col-md mg-b-10 mg-md-b-0">
        <nuxt-link
          class="tx-deco-none"
          to="/performance/slas/performance-by-month"
        >
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
      </div>
      <div class="col-12 col-md mg-b-10 mg-md-b-0">
        <nuxt-link
          class="tx-deco-none"
          to="/performance/slas/performance-by-month"
        >
          <div class="card card-status">
            <div class="media">
              <i class="icon ion-ios-bookmarks-outline tx-teal"></i>
              <div class="media-body">
                <h1 v-if="months[0]">
                  {{
                    parseInt(
                      (months[0].slaPerformance.timelyRequests /
                        months[0].slaPerformance.count) *
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
      <div class="col-12 col-md mg-b-10 mg-md-b-0">
        <div
          class="tx-deco-none"
          :style="{ cursor: 'pointer' }"
          v-on:click="openJobsPastSla"
        >
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
      <div class="col mg-t-10 mg-lg-t-0">
        <div class="card card-status">
          <div class="media">
            <i class="icon ion-happy-outline tx-teal"></i>
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
              <p>Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Work Past SLA modal -->
    <div class="wrapper" v-if="openWorkPastSla == 1">
      <div class="container">
        <div
          class="nav-statistics-wrapper"
          :style="{
            display: 'flex',
            justifyContent: 'spaceBetween'
          }"
        >
          <nav class="nav">
            <div class="nav-link" exact-active-class="active">Requests</div>
          </nav>
          <!-- </div> -->
          <button
            type="button"
            class="close"
            v-on:click="openJobsPastSla"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div>
          <select
            class="form-control select-month"
            v-on:change="getJobsPastSlaForMonth($event)"
          >
            <option value="">Filter By Month</option>

            <option
              v-for="month in months"
              :key="month.id"
              :value="month.name"
              v-text="month.name"
            ></option>
          </select>
        </div>
        <div class="col-lg-12">
          <div class="table-responsive" v-if="!workRequestsLoading">
            <table
              class="table table-stripped"
              id="mytable"
              v-if="worksPastSlaPerMonth == 0"
            >
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody v-for="workRequest in workRequests" :key="workRequest.id">
                <tr
                  v-if="
                    workRequest.slaInfo &&
                      !workRequest.status.name
                        .toLowerCase()
                        .includes('complete') &&
                      workRequest.slaInfo.timeExpended >
                        workRequest.slaInfo.expectedDuration
                  "
                >
                  <td>
                    <quick-request-data :workRequest="workRequest" />
                  </td>
                  <td>
                    <nuxt-link
                      class="tx-inverse"
                      :to="
                        `/people/users/details?id=${workRequest.createdBy.id}`
                      "
                      v-text="workRequest.createdBy.name"
                      v-if="authorized('people.users.details')"
                    ></nuxt-link>
                    <span
                      class="tx-inverse"
                      v-else
                      v-text="workRequest.createdBy.name"
                    ></span>
                  </td>
                  <td>
                    <span>{{ workRequest.created_at | dateFormat }}</span>
                  </td>
                  <td>
                    <span v-text="workRequest.status.name"></span>
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              class="table table-stripped"
              id="mytable"
              v-else-if="
                worksPastSlaPerMonth == 1 && worksPastSlaForEachMonth.length > 1
              "
            >
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody
                v-for="workRequest in worksPastSlaForEachMonth"
                :key="workRequest.id"
              >
                <tr
                  v-if="
                    workRequest.slaInfo &&
                      !workRequest.status.name
                        .toLowerCase()
                        .includes('complete') &&
                      workRequest.slaInfo.timeExpended >
                        workRequest.slaInfo.expectedDuration
                  "
                >
                  <td>
                    <quick-request-data :workRequest="workRequest" />
                  </td>
                  <td>
                    <nuxt-link
                      class="tx-inverse"
                      :to="
                        `/people/users/details?id=${workRequest.createdBy.id}`
                      "
                      v-text="workRequest.createdBy.name"
                      v-if="authorized('people.users.details')"
                    ></nuxt-link>
                    <span
                      class="tx-inverse"
                      v-else
                      v-text="workRequest.createdBy.name"
                    ></span>
                  </td>
                  <td>
                    <span>{{ workRequest.created_at | dateFormat }}</span>
                  </td>
                  <td>
                    <span v-text="workRequest.status.name"></span>
                  </td>
                </tr>
              </tbody>
            </table>

            <table class="table table-stripped" id="mytable" v-else>
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody
                v-for="workRequest in worksPastSlaForEachMonth"
                :key="workRequest.id"
              >
                <tr class="no-data">
                  No Data Found
                  <!-- <td>
                    No Data Found
                  </td> -->
                  <!-- <td>
                    <nuxt-link
                      class="tx-inverse"
                      :to="
                        `/people/users/details?id=${workRequest.createdBy.id}`
                      "
                      v-text="workRequest.createdBy.name"
                      v-if="authorized('people.users.details')"
                    ></nuxt-link>
                    <span
                      class="tx-inverse"
                      v-else
                      v-text="workRequest.createdBy.name"
                    ></span>
                  </td>
                  <td>
                    <span>{{ workRequest.created_at | dateFormat }}</span>
                  </td>
                  <td>
                    <span v-text="workRequest.status.name"></span>
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>
          <loading v-else />
        </div>

        <!-- col-4 -->
        <!-- </div> -->
        <!-- </div> -->
        <!-- row -->

        <!-- </v-modal> -->
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";
import vPaginate from "@/components/ui/paginate";
import quickRequestData from "@/components/maintenance/requests/quick-data";
import moment from "moment";
import { mapActions } from "vuex";
import slaMixin from "@/mixins/performance/sla";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";

export default {
  components: { loading, quickRequestData, vPaginate, vModal },
  created() {
    this.setMonths();

    this.getData();
    this.$store.commit("maintenance/workRequests/toggleRefresh");
    this.getWorkRequests(this);
    this.setUser(this.id);
  },

  data: () => ({
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
    workRequestStatusCodes: [],
    isClient: false
  }),
  methods: {
    ...mapActions({
      getWorkRequests: "maintenance/workRequests/getWorkRequests"
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
        ).format("YYYY-MM-DD h:mm:ss")
      };
    },
    async setMonths(maintenanceTypeCodes) {
      const monthOnMonthData = this.$store.state.performance.slaReports
        .monthOnMonthData;
      this.months = [];

      // if (monthOnMonthData) {
      //   this.months = monthOnMonthData.months;
      //   this.reportLoading = monthOnMonthData.reportLoading;
      //   return;
      // }

      if (typeof maintenanceTypeCodes === "undefined") {
        maintenanceTypeCodes = ["corrective", "preventive"];
      }

      var currentDate = new Date();
      for (var index = 0; index < 12; index++) {
        const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
          currentDate
        );
        this.$store.commit("maintenance/workRequests/toggleRefresh");

        const [slaPerformance, approvalPerformance] = await Promise.all([
          this.getSlaPerformance({
            rangeFrom,
            rangeTo,
            maintenanceTypeCodes
          }),
          this.getSlaPerformance({
            rangeFrom,
            rangeTo,
            slaStatusCodes: ["35", "105"],
            maintenanceTypeCodes
          })
        ]);

        if (slaPerformance.count > 0)
          this.months.push({
            approvalPerformance,
            slaPerformance,
            name,
            rangeFrom,
            rangeTo
          });

        // clock in 5 days to previous month
        currentDate = new Date(rangeFrom);
        currentDate.setDate(currentDate.getDate() - 5);
      }
      this.reportLoading = false;
      this.$store.commit(
        "performance/slaReports/setMonthOnMonthData",
        JSON.parse(JSON.stringify(this.$data))
      );
    },

    /************************************************************** */

    async setUser(id) {
      const { detailedAssociations, users } = this.$store.state.people.users;
      this.user = users.find(user => user.id == id);
      if (this.user && !this.shouldRefresh) return (this.userLoading = false);

      try {
        const user = (
          await this.$axios.get("users/" + id, {
            params: { associations: detailedAssociations }
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
            !this.workRequests[i].status.name
              .toLowerCase()
              .includes("complete") &&
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
      getRatings: "performance/ratings/getRatings"
    }),
    async getData() {
      var roles = this.$store.state.auth.user.roles;
      this.id = this.$store.state.auth.user.id;
      roles = roles.filter(role => role.code == "OCC");
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
      const [
        currentMonthSla,
        currentMonthApprovalPerformance
      ] = await Promise.all([
        this.getSlaPerformance({
          rangeFrom,
          rangeTo,
          allotedPercentageTime: 80
        }),
        this.getSlaPerformance({
          allotedPercentageTime: 20,
          rangeFrom,
          rangeTo,
          slaStatusCodes: ["35", "105"]
        })
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
        ).format("YYYY-MM-DD h:mm:ss")
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
    }
  },
  middleware: ["auth", "roleGuard"],
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) return this.setUser(to.query.id);
    }
  },
  mixins: [slaMixin, authMixin, modalMixin]
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
</style>
